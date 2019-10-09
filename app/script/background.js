const nem = require('nem2-sdk')
const {
    Account, NetworkType, TransactionHttp, UInt64
} = nem
const account = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.MIJIN_TEST
)
const GENERATION_HASH = '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6'
const END_POINT = 'https://fushicho.48gh23s.xyz:3001'

const confirmations = {
    items: {},
    get(key) {
        return this.items[key]
    },
    push(key, item) {
        this.items[key] = item
        this.setBadge()
    },
    delete(key) {
        delete this.items[key]
        this.setBadge()
    },
    count() {
        return Object.keys(this.items).length
    },
    countStr() {
        return this.count().toString()
    },
    setBadge() {
        const text = this.countStr()
        chrome.browserAction.setBadgeText({text: text === "0" ? "" : text })
    }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background', request);
    if (request.method === 'sendTransaction') {
        chrome.tabs.create({
            url: 'notification.html',
            active: true,
        }, (tab) => {
            console.log('tab opened', tab)
            confirmations.push(
                tab.id,
                new Confirmation(
                    request.data.name,
                    request.data.payload,
                    request.processId,
                    tab,
                    sendResponse
                )
            )
        })
    }
    return true
});

window.fromPopup = function() {
    chrome.browserAction.setBadgeText({text: Date.now().toString().substr(-4)})
    return Date.now()
}

window.popup = {
    accept(tabId) {
        const conf = confirmations.get(tabId)
        if (conf === undefined) {
            return
        }
        conf.announce()
        confirmations.delete(tabId)
    },
    deny(tabId) {
        const conf = confirmations.get(tabId)
        if (conf === undefined) {
            return
        }
        conf.cancel()
        confirmations.delete(tabId)
    }
}

class Confirmation {
    constructor(transactionName, payload, processId, tab, sendResponse) {
        this.transactionName = transactionName
        this.payload = payload
        this.processId = processId
        this.tab = tab
        this.sendResponse = sendResponse
    }

    getTabId() {
        return this.tab.id
    }

    announce() {
        let tx = nem[this.transactionName].createFromPayload(this.payload)
        tx.maxFee = UInt64.fromUint(20000)
        const signed = account.sign(tx, GENERATION_HASH)
        const transactionHttp = new TransactionHttp(END_POINT)
        transactionHttp.announce(signed).toPromise().then(
            () => {
                this.sendResponse({
                    result: 'success',
                    processId: this.processId,
                    data: {transactionHash: signed.hash}})
            },
            (e) => {
                this.sendResponse({
                    result: 'fail',
                    processId: this.processId,
                    data: {error: e}})
            }
        )
    }

    cancel() {
        this.sendResponse({
            result: 'fail',
            processId: this.processId,
            data: {error: new Error('user denied')}})
    }
}