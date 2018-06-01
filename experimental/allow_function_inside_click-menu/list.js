// Persistent whitelist and blocklist
'use strict';

var DC = DC || {};

DC.blocklist = {}; // list of blocked hostnames or urls
DC.blocklistSubdomain = []; // list of allowed subdomains

DC.load = function () {
	// load blocklist from local storage
	DC.blocklist = localStorage.hasOwnProperty('blockLIST') ? JSON.parse(localStorage.getItem('blockLIST')) : {};
	// extract entries that starts with asterisk, e.g "*.google.com"
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

DC.save = function () {
	// save blocklist to local storage
	localStorage.setItem('blockLIST', JSON.stringify(DC.blocklist));
};

DC.load();