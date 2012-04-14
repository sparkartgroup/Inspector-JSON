chrome.tabs.onUpdated.addListener( function(){ console.log( arguments ) } );

chrome.extension.onRequest.addListener( function( request, sender, sendResponse ){
	
	chrome.pageAction.show( sender.tab.id );
	
});

chrome.pageAction.onClicked.addListener( function(){ console.log( arguments ) } );

console.log('background.js');