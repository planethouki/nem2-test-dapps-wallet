const nem = require('nem2-sdk')
const {
    TransactionHttp, UInt64
} = nem

export class Confirmation {
    constructor(transactionName, payload, processId, tab, sendResponse) {
        this.transactionName = transactionName
        this.payload = payload
        this.processId = processId
        this.tab = tab
        this.sendResponse = sendResponse
        this.transaction = nem[transactionName].createFromPayload(payload)
        this.transaction.maxFee = UInt64.fromUint(20000)
    }

    getTabId() {
        return this.tab.id
    }

    getTransaction() {
        return this.transaction
    }

    getTransactionJson() {
        return this.transaction.toJSON()
    }

    announce(signed, endPoint) {
        const transactionHttp = new TransactionHttp(endPoint)
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