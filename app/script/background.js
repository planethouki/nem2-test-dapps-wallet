const nem = require('nem2-sdk')
const {
    Account, NetworkType, TransactionHttp, TransferTransaction, UInt64
} = nem
const account = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.MIJIN_TEST
)
const generationHash = '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6'
const endPoint = 'https://fushicho.48gh23s.xyz:3001'
const transactionHttp = new TransactionHttp(endPoint)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background', request);
    if (request.method === 'sendTransaction') {
        let tx = nem[request.data.name].createFromPayload(request.data.transaction)
        tx.maxFee = UInt64.fromUint(20000)
        const signed = account.sign(tx, generationHash)
        transactionHttp.announce(signed).toPromise().then(
            () => {
                sendResponse({
                    result: 'success',
                    processId: request.processId,
                    data: {transactionHash: signed.hash}})
            },
            (e) => {
                sendResponse({
                    result: 'fail',
                    processId: request.processId,
                    data: {error: e}})
            }
        )

    }
    return true;
});