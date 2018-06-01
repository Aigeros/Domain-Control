// popup in browser action
'use strict';

var DC = DC || {};

DC.send = function (aCmd, aDomain, aCallback) {
	// send message to deny domain
	chrome.runtime.sendMessage({
		cmd: aCmd,
		domain: aDomain
	}, aCallback);
};

DC.addOneDomain = function (aParent, aDomain, aBlocked) {
	// add one domain to list
	var li,
	deny;
	li = document.createElement('li');
	// deny
	deny = document.createElement('a');
	deny.style.color = aBlocked ? 'red' : 'green';
	deny.href = '#';
	deny.innerText = aBlocked ? '✘' : '✔';
	deny.title = aBlocked ? 'allow' : 'deny';
	deny.onclick = function () {
		DC.send(aBlocked ? 'allow' : 'deny', aDomain, DC.refreshAndRender);
		return false;
	};
	li.appendChild(deny);
	// domain name
	li.appendChild(document.createTextNode(aDomain));
	aParent.appendChild(li);
};

DC.renderList = function (aDomains) {
	// render table with recently blocked domains
	var d, sorted,
	o = document.getElementById('list'),
	n = document.createElement('ol');
	if (aDomains.length <= 0) {
		o.innerText = 'Nothing found on this tab, try to refresh.';
		return;
	}
	// domains
	sorted = Object.keys(aDomains).sort();
	for (d = 0; d < sorted.length; d++) {
  		DC.addOneDomain(n, sorted[d], aDomains[sorted[d]]);
	}
	o.parentNode.replaceChild(n, o);
    n.id = 'list';
};

DC.refreshAndRender = function () {
	// ask background script for list of blocked domains
	chrome.runtime.sendMessage({
		cmd: 'recent'
	}, function (aDomains) {
		DC.renderList(aDomains);
	});
};

window.addEventListener('DOMContentLoaded', DC.refreshAndRender);
