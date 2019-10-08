const LocalMessageDuplexStream = require('post-message-stream')

const inpageStream = new LocalMessageDuplexStream({
    name: 'contentscript',
    target: 'inpage',
})
inpageStream.on('data', (data) => {
    console.log('inpageStream', data)
    chrome.runtime.sendMessage(data, function(response) {
        console.log('inpageStream', response)
        inpageStream.write(response)
    });
})

chrome.storage.local.set(
    {
        "value1": "string1",
        "value2": "string2"
    }
)

chrome.storage.local.get(["value1", "value2"], function(items) {
    console.log(items.value1); // -> "string1"
    console.log(items.value2); // -> "string2"
})

function injectScript () {
    try {
        const c = document.head || document.documentElement
        const s = document.createElement('script')
        s.setAttribute('async', false)
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', chrome.extension.getURL('/inpage.js'));
        // c.insertBefore(s, c.children[0])
        // c.removeChild(s)
        c.appendChild(s);
    } catch (e) {
        console.error('injection failed', e)
    }
}

injectScript()

