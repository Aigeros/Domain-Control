// background script
'use strict';
var DC = DC || {};
DC.blockedDomains = {};

// number of recently loaded items on badge
DC.updateBadge = function () {
	var b = Object.keys(DC.blockedDomains).length;
	chrome.browserAction.setBadgeText({
		text: (b ? b.toString() : '')
	});
};

// badge color
chrome.browserAction.setBadgeBackgroundColor({
	color: "#9A9A9A"
});

// block url entries in blocklist
DC.beforeRequest = function (aDetails) {
	var i,
	u = new URL(aDetails.url);
	if (DC.blocklist.hasOwnProperty(u.hostname)) {
		return {
			cancel: true
		};
	}
	// block subdomains (*.example.com)
	for (i = 0; i < DC.blocklistSubdomain.length; i++) {
		if (u.hostname.substr(-DC.blocklistSubdomain[i].length) === DC.blocklistSubdomain[i]) {
			console.log(u.hostname + 'subdomain to block' + DC.blocklistSubdomain[i]);
			return {
				cancel: true
			};
		}
	}
	// hide blocked on badge counter
	if (!DC.blocklist.hasOwnProperty(u.hostname)) {
		DC.blockedDomains[u.hostname] = 1;
	}
	// update badge
	DC.updateBadge();
};

// set webRequest handler
chrome.webRequest.onBeforeRequest.addListener(DC.beforeRequest, {
	urls: ["http://*/*", "https://*/*"]
}, ['blocking']);

// clear pop-up-menu when tab changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'loading' && tab.active) {
		DC.blockedDomains = {};
		DC.updateBadge();
	}
});

// clear pop-up-menu when tab closes
chrome.tabs.onRemoved.addListener(function (tabId) {
	DC.blockedDomains = {};
	DC.updateBadge(tabId);
});

// receive message from pop-up or options
chrome.extension.onMessage.addListener(function (aRequest, aSender, aSendResponse) {
	if (!aSender) {
		return;
	}
	switch (aRequest.cmd) {
		// reload lists
	case 'reload':
		DC.blockedDomains = {};
		DC.load();
		break;
		// send list of recently blocked
	case 'blocked':
		aSendResponse(Object.keys(DC.blockedDomains));
		break;
		// deny domain
	case 'deny':
		DC.blocklist[aRequest.domain] = 1;
		delete DC.blockedDomains[aRequest.domain];
		DC.save();
		break;
	}
	return true;
});