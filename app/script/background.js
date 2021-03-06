import {
    Account, AccountHttp, Address, NetworkHttp, NetworkType, TransactionHttp, UInt64, Password, EncryptedPrivateKey, SimpleWallet
} from 'nem2-sdk'

import { Confirmation } from './lib/Confirmation'

const wallets = {
    accounts: [],
    networks: [
        {
            endPoint: 'https://fushicho.48gh23s.xyz:3001',
            currencyMosaicId: '26441EAFBAE569AB',
            generationHash: '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6',
            networkType: NetworkType.MIJIN_TEST
        }
    ],
    getAccountByIndex(index) {
        return this.accounts[index]
    },
    getNetworkByIndex(index) {
        return this.networks[index]
    },
    setAccounts(accounts) {
        this.accounts = accounts
    },
    addAccount(account) {
        this.accounts.push(account);
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    existsAccount() {
        return this.accounts.length !== 0;
    }
};


const currentAccount = {
    index: 0,
    password: null,
    sendMessageToPopup: () => {},
    sendMessageToNotification: () => {},
    address() {
        return wallets.getAccountByIndex(this.index).address
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
        );
        confirmation.announce(signedTransaction, this.endPoint())
    },
    setPassword(str) {
        this.password = new Password(str);
        this.sendMessageToPopup({ existsPassword: true });
        this.sendMessageToNotification({ existsPassword: true })
    },
    existsPassword() {
        return !!this.password;
    },
    addAccount(name, encryptedKey, iv, address) {
        wallets.addAccount({
            name,
            encryptedKey,
            iv,
            address
        });
        this.sendMessageToPopup({ existsAccount: true });
        this.sendMessageToNotification({ existsAccount: true })
    },
    existsAccount() {
        return wallets.existsAccount()
    },
    setSendMessageToPopup(cb) {
        this.sendMessageToPopup = cb
    },
    setSendMessageToNotification(cb) {
        this.sendMessageToNotification = cb
    }
};

const confirmations = {
    items: {},
    get(key) {
        return this.items[key]
    },
    push(key, item) {
        this.items[key] = item;
        this.setBadge()
    },
    delete(key) {
        delete this.items[key];
        this.setBadge()
    },
    count() {
        return Object.keys(this.items).length
    },
    countStr() {
        return this.count().toString()
    },
    setBadge() {
        const text = this.countStr();
        chrome.browserAction.setBadgeText({text: text === "0" ? "" : text })
    }
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background', request);
    switch (request.method) {
        case 'sendTransaction':
            chrome.tabs.create({
                url: 'notification.html',
                active: true,
            }, (tab) => {
                console.log('tab opened', tab);
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
            });
            break;
        case 'beforePageLoad':
            sendResponse({
                existsAccount: currentAccount.existsAccount(),
                existsPassword: currentAccount.existsPassword()
            });
            break;
        case 'getAddress':
            sendResponse({
                result: 'success',
                data: currentAccount.address(),
                processId: request.processId
            });

    }
    return true
});

window.popup = {
    setCallback(cb) {
        currentAccount.setSendMessageToPopup(cb)
    },
    existsAccount() {
        return currentAccount.existsAccount()
    },
    setInitialAccount(privateKey, password) {
        let simpleWallet = SimpleWallet.createFromPrivateKey(
            'Account 1',
            new Password(password),
            privateKey,
            currentAccount.networkType()
        );
        currentAccount.addAccount(
            'Account 1',
            simpleWallet.encryptedPrivateKey.encryptedKey,
            simpleWallet.encryptedPrivateKey.iv,
            simpleWallet.address.pretty()
        );
        this.setPassword(password);
        simpleWallet = undefined
    },
    existsPassword() {
        return currentAccount.existsPassword()
    },
    setPassword(str) {
        currentAccount.setPassword(str)
    },
    getAccountStaticInfo() {
        return {
            address: currentAccount.address(),
            endPoint: currentAccount.endPoint()
        }
    },
    getTransactions() {
        const address = currentAccount.address();
        const url = currentAccount.endPoint();
        const networkHttp = new NetworkHttp(url);
        const accountHttp = new AccountHttp(url, networkHttp);
        return accountHttp.transactions(Address.createFromRawAddress(address)).toPromise().then(
            (transactions) => {
                const tx4 = transactions.slice(0, 4).map((t) => t.transactionInfo.hash);
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
        const address = currentAccount.address();
        const url = currentAccount.endPoint();
        const networkHttp = new NetworkHttp(url);
        const accountHttp = new AccountHttp(url, networkHttp);
        return accountHttp.getAccountInfo(Address.createFromRawAddress(address)).toPromise().then(
            (accountInfo) => {
                const mosaic = accountInfo.mosaics.find((mosaic) => {
                    return mosaic.id.id.equals(UInt64.fromHex(currentAccount.currencyMosaicId()))
                });
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
};

window.notification = {
    get(tabId) {
        const conf = confirmations.get(tabId);
        if (conf === undefined) {
            return
        }
        return conf.getTransactionJson()
    },
    accept(tabId) {
        const conf = confirmations.get(tabId);
        if (conf === undefined) {
            return
        }
        currentAccount.announce(conf);
        confirmations.delete(tabId)
    },
    deny(tabId) {
        const conf = confirmations.get(tabId);
        if (conf === undefined) {
            return
        }
        currentAccount.cancel(conf);
        confirmations.delete(tabId)
    }
};

// const accountsStorage = window.localStorage.getItem('accounts');
// if (accountsStorage) {
//     console.log('accountsStorage', accountsStorage);
//     wallets.setAccounts(JSON.parse(accountsStorage))
// }

// private key: 25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E
// password: password
wallets.setAccounts([{ name: 'Account1',
    encryptedKey: 'd1f4744612f0969bbe26bf374cb4af770af5c06da1d1ce770f384932fb7696373550fd9c712cf85c05957838abddf765',
    iv: 'BF56924B12F2699CB1E3C794391398F6',
    address: 'SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2' }])
