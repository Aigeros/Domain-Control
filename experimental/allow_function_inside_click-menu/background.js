// Background script
'use strict';

var DC = DC || {};

DC.enabled = true;
DC.recent = {};	    // Recently seen domains, previously it was blockedDomains but now we thack both blocked and not blocked so calling it "recent" as in recently seen domains makes more sense

DC.updateBadge = function () {
	// show number of recently loaded items on badge
	var b = Object.keys(DC.recent).length;
	if (!DC.enabled) {
		b = 'off';
	}
	chrome.browserAction.setBadgeText({
		text: (b ? b.toString() : '')
	});
};

// badge counter color
chrome.browserAction.setBadgeBackgroundColor({ color: "#A0A0A0"});

DC.beforeRequest = function (aDetails) {
	// allow all if disabled
	if (!DC.enabled) {
		return {
			cancel: false
		};
	}
	// block individual urls in blocklist
	var i,
	u = new URL(aDetails.url);

    // remember what was recently seen
    DC.recent[u.hostname] = true;

	// update badge
	DC.updateBadge();

    // only block if is in blocklist with value 1
	if (DC.blocklist.hasOwnProperty(u.hostname) && (DC.blocklist[u.hostname] === 1)) {
		return {
			cancel: true
		};
	}
    /*  // I temporarily disabled * matching
	// block subdomains (*.example.com)
	for (i = 0; i < DC.blocklistSubdomain.length; i++) {
		if (u.hostname.substr(-DC.blocklistSubdomain[i].length) === DC.blocklistSubdomain[i]) {
			console.log(u.hostname + 'subdomain to block' + DC.blocklistSubdomain[i]);
			return {
				cancel: true
			};
		}
	}
    */
};

// set webRequest handler
chrome.webRequest.onBeforeRequest.addListener(
	DC.beforeRequest, {
	urls: ["http://*/*", "https://*/*"]
},
	['blocking']);

// auto-clear of findings
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'loading' && tab.active) {
		DC.recent = {};
		DC.updateBadge();
	}
})

chrome.extension.onMessage.addListener(function (aRequest, aSender, aSendResponse) {
	// receive message from popup or options
	if (!aSender) {
		return;
	}
	switch (aRequest.cmd) {
	case 'reload':
		// reload lists
		DC.recent = {};
		DC.load();
		break;
	case 'recent':
		// send list of recently seen domains and whether they were blocked or not
        var d;
        for (d in DC.recent) {
            if (DC.recent.hasOwnProperty(d)) {
                DC.recent[d] = DC.blocklist.hasOwnProperty(d) ? DC.blocklist[d] : 0;
            }
        }
		aSendResponse(DC.recent);
		break;
	case 'allow':
		// allow domain (0=not blocked)
        console.log('allow', aRequest.domain, 0);
		DC.blocklist[aRequest.domain] = 0;
		DC.save();
		break;
	case 'deny':
		// deny domain (1=blocked)
        console.log('deny', aRequest.domain, 1);
		DC.blocklist[aRequest.domain] = 1;
		DC.save();
		break;
	}
});
