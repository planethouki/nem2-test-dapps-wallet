import {
    Account, AccountHttp, Address, NetworkHttp, NetworkType, SimpleWallet, TransactionHttp, UInt64, Password
} from 'nem2-sdk'

import { Confirmation } from './lib/Confirmation'

const wallets = {
    networks: [
        {
            endPoint: 'https://fushicho.48gh23s.xyz:3001',
            currencyMosaicId: '26441EAFBAE569AB',
            generationHash: '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6',
            networkType: NetworkType.MIJIN_TEST
        }
    ],
    items: [
        '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
    ],
    getAccountByIndex(index) {
        return Account.createFromPrivateKey(this.items[index], this.networks[index].networkType)
    },
    getNetworkByIndex(index) {
        return this.networks[index]
    }
}


const currentAccount = {
    index: 0,
    address() {
        return wallets.getAccountByIndex(this.index).address.pretty()
    },
    endPoint() {
        return wallets.getNetworkByIndex(this.index).endPoint
    },
    generationHash() {
        return wallets.getNetworkByIndex(this.index).generationHash
    },
    networkType() {
        return wallets.getNetworkByIndex(this.index).networkType
    },
    currencyMosaicId() {
        return wallets.getNetworkByIndex(this.index).currencyMosaicId
    },
    cancel(confirmation) {
        confirmation.cancel()
    },
    announce(confirmation) {
        const signedTransaction = wallets.getAccountByIndex(this.index).sign(
            confirmation.getTransaction(),
            this.generationHash()
        )
        confirmation.announce(signedTransaction, this.endPoint())
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


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
    } else if (request.method === 'beforePageLoad') {
        // todo check existsAccount
        // todo check existsPassword
        sendResponse({
            existsAccount: true,
            existsPassword: true
        });
    }
    return true
});

window.popup = {
    getAccountStaticInfo() {
        return {
            address: currentAccount.address(),
            endPoint: currentAccount.endPoint()
        }
    },
    getTransactions() {
        const address = currentAccount.address()
        const url = currentAccount.endPoint()
        const networkHttp = new NetworkHttp(url)
        const accountHttp = new AccountHttp(url, networkHttp)
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
        const address = currentAccount.address()
        const url = currentAccount.endPoint()
        const networkHttp = new NetworkHttp(url)
        const accountHttp = new AccountHttp(url, networkHttp)
        return accountHttp.getAccountInfo(Address.createFromRawAddress(address)).toPromise().then(
            (accountInfo) => {
                const mosaic = accountInfo.mosaics.find((mosaic) => {
                    return mosaic.id.id.equals(UInt64.fromHex(currentAccount.currencyMosaicId()))
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
    get(tabId) {
        const conf = confirmations.get(tabId)
        if (conf === undefined) {
            return
        }
        return conf.getTransactionJson()
    },
    accept(tabId) {
        const conf = confirmations.get(tabId)
        if (conf === undefined) {
            return
        }
        currentAccount.announce(conf)
        confirmations.delete(tabId)
    },
    deny(tabId) {
        const conf = confirmations.get(tabId)
        if (conf === undefined) {
            return
        }
        currentAccount.cancel(conf)
        confirmations.delete(tabId)
    }
}
