// pop-up in browser action
'use strict';

var DC = DC || {};

// send message to deny domain
DC.send = function (aCmd, aDomain) {
	chrome.runtime.sendMessage({
		cmd: aCmd,
		domain: aDomain
	}, function (aReply) {});
};

// add domain to list
DC.addOneDomain = function (aParent, aDomain) {
	var li,
	deny;
	li = document.createElement('li');
	// deny
	deny = document.createElement('a');
	deny.style.color = 'red';
	deny.href = '#';
	deny.innerText = '✘';
	deny.title = 'deny';
	deny.onclick = function () {
		DC.send('deny', aDomain);
		li.parentNode.removeChild(li);
		return false;
	};
	li.appendChild(deny);
	// domain name
	li.appendChild(document.createTextNode(aDomain));
	aParent.appendChild(li);
};

// render table with recently blocked domains
DC.renderList = function (aDomains) {
	var i,
	o = document.getElementById('list'),
	n = document.createElement('ol');
	if (aDomains.length <= 0) {
		o.innerText = 'Refresh this tab for new results (F5)';
		return;
	}
	// domains
	aDomains.sort();
	for (i = 0; i < aDomains.length; i++) {
		DC.addOneDomain(n, aDomains[i]);
	}
	o.parentNode.replaceChild(n, o);
};

// ask background script for list of blocked domains
window.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.sendMessage({
		cmd: 'blocked'
	}, function (aDomains) {
		DC.renderList(aDomains);
	});
});