// add context menu
function createContextMenu() {
	chrome.contextMenus.create({
		title: 'Block content',
		id: 'contextmenu',
		contexts: ['all']
	});
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	// clear findings in pop-up
	if (info.menuItemId === "contextmenu") {
		DC.blockedDomains = {};
	}
});
