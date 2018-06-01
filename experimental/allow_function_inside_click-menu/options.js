// Options callbacks
'use strict';

var DC = DC || {};

window.addEventListener('DOMContentLoaded', function () {
	// show list
	DC.tb = document.getElementById('blocklist');
	DC.tb.value = Object.keys(DC.blocklist).sort().join('\n');
	// save list
	document.getElementById('save').addEventListener('click', function () {
		var a,
		i;
		// blocklist
		DC.blocklist = {};
		a = DC.tb.value.trim().split('\n');
		for (i = 0; i < a.length; i++) {
			DC.blocklist[a[i]] = 1;
		}
		// tell background script to reload list
		DC.save();
		chrome.runtime.sendMessage({
			cmd: 'reload'
		});
	});
});