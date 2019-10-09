const nem = require('nem2-sdk')
const {
    Account, AccountHttp, Address, NetworkHttp, NetworkType, SimpleWallet, TransactionHttp, UInt64, Password
} = nem

const GENERATION_HASH = '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6'
const END_POINT = 'https://fushicho.48gh23s.xyz:3001'
const NETWORK_TYPE = NetworkType.MIJIN_TEST
const CURRENCY_MOSAIC_ID = '26441EAFBAE569AB'

const wallets = {
    items: [
        '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
    ],
    getAccountByIndex(index) {
        return Account.createFromPrivateKey(this.items[index], NETWORK_TYPE)
    }
}


const currentAccount = {
    sign(...args) {
        return wallets.getAccountByIndex(0).sign(...args)
    },
    getAddress() {
        return wallets.getAccountByIndex(0).address.pretty()
    },
    getEndpoint() {
        return END_POINT
    }
}

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

window.popup = {
    getAccountStaticInfo() {
        return {
            address: currentAccount.getAddress(),
            endPoint: currentAccount.getEndpoint()
        }
    },
    getTransactions() {
        const address = currentAccount.getAddress()
        const networkHttp = new NetworkHttp(END_POINT)
        const accountHttp = new AccountHttp(END_POINT, networkHttp)
        return accountHttp.transactions(Address.createFromRawAddress(address)).toPromise().then(
            (transactions) => {
                const tx4 = transactions.slice(0, 4).map((t) => t.transactionInfo.hash)
                return {
                    transactions: [...tx4, '', '', '', ''].slice(0, 4)
                }
            },
            (e) => {
                return {
                    transactions: ['', '', '', '']
                }
            }
        )
    },
    getAccountInfo() {
        const address = currentAccount.getAddress()
        const networkHttp = new NetworkHttp(END_POINT)
        const accountHttp = new AccountHttp(END_POINT, networkHttp)
        return accountHttp.getAccountInfo(Address.createFromRawAddress(address)).toPromise().then(
            (accountInfo) => {
                const mosaic = accountInfo.mosaics.find((mosaic) => {
                    return mosaic.id.id.equals(UInt64.fromHex(CURRENCY_MOSAIC_ID))
                })
                return {
                    balance: mosaic ? mosaic.amount.toString() : "0"
                }
            },
            (e) => {
                return {
                    balance: "0"
                }
            }
        )
    }
}

window.notification = {
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
        const signed = currentAccount.sign(tx, GENERATION_HASH)
        const transactionHttp = new TransactionHttp(END_POINT)
        transactionHttp.announce(signed).toPromise().then(
            () => {
                this.sendResponse({
                    result: 'success',
                    processId: this.processId,
                    data: {transactionHash: signed.hash}})
            },
            (error) => {
                this.sendResponse({
                    result: 'fail',
                    processId: this.processId,
                    error: error.toString()
                })
            }
        )
    }

    cancel() {
        this.sendResponse({
            result: 'fail',
            processId: this.processId,
            error: 'user denied'
        })
    }
}