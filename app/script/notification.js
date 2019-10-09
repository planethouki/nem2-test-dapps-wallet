$('#submit').on('click', function(){
    console.log('submit clicked')
    chrome.tabs.getCurrent((tab) => {
        chrome.extension.getBackgroundPage().notification.accept(tab.id)
        chrome.tabs.remove(tab.id)
    })
});

$('#close').on('click', function(){
    console.log('close clicked')
    chrome.tabs.getCurrent((tab) => {
        chrome.extension.getBackgroundPage().notification.deny(tab.id)
        chrome.tabs.remove(tab.id)
    })
});
