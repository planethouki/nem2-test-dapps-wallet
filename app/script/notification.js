$(() => {

    chrome.tabs.getCurrent((tab) => {
        const transactionInfo = chrome.extension.getBackgroundPage().notification.get(tab.id);
        $('#transaction-info').text(
            JSON.stringify(transactionInfo.transaction, null, '  ')
        )
    });

    $('#confirm').on('click', function(){
        console.log('submit clicked');
        chrome.tabs.getCurrent((tab) => {
            chrome.extension.getBackgroundPage().notification.accept(tab.id);
            chrome.tabs.remove(tab.id)
        })
    });

    $('#reject').on('click', function(){
        console.log('close clicked');
        chrome.tabs.getCurrent((tab) => {
            chrome.extension.getBackgroundPage().notification.deny(tab.id);
            chrome.tabs.remove(tab.id)
        })
    });

});
