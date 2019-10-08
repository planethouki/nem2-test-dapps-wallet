const sdk = require('nem2-sdk')

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background', request);
    if (request.greeting === "hello")
        sendResponse({farewell: "goodbye"});
    return true;
});