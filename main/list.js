// persistent blocklist
'use strict';
var DC = DC || {};
// list of blocked hostnames or urls
DC.blocklist = {};
// list of blocked subdomains
DC.blocklistSubdomain = [];
// load blocklist from local storage
DC.load = function () {
	// extract entries that starts with asterisk (*.example.com)
	DC.blocklist = localStorage.hasOwnProperty('blockLIST') ? JSON.parse(localStorage.getItem('blockLIST')) : {};
	var k;
	DC.blocklistSubdomain = [];
	for (k in DC.blocklist) {
		if (DC.blocklist.hasOwnProperty(k)) {
			if (k.substr(0, 2) === '*.') {
				DC.blocklistSubdomain.push(k.substr(1));
			}
		}
	}
};
// save blocklist to local storage
DC.save = function () {
	localStorage.setItem('blockLIST', JSON.stringify(DC.blocklist));
};
DC.load();