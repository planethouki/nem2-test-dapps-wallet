const LocalMessageDuplexStream = require('post-message-stream');

const inpageStream = new LocalMessageDuplexStream({
    name: 'nw6i519ganfrhq8ax05v215txcor9rtk5rpcxcfz',
    target: 'zskmgbd0e32f5siy5ua973kqush6xxk5qd0hg3f2',
});

inpageStream.on('data', (data) => {
    chrome.runtime.sendMessage(data, function(response) {
        inpageStream.write(response)
    });
});

function injectScript () {
    try {
        const c = document.head || document.documentElement;
        const s = document.createElement('script');
        s.setAttribute('async', false);
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', chrome.extension.getURL('/inpage.js'));
        // c.insertBefore(s, c.children[0])
        // c.removeChild(s)
        c.appendChild(s);
    } catch (e) {
        console.error('injection failed', e)
    }
}


chrome.runtime.sendMessage({method: 'beforePageLoad'}, function(response) {
    console.log(response);
    if (response.existsAccount && response.existsPassword) {
        injectScript();
    }
});


