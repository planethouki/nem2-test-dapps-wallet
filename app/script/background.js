const {
    Account, NetworkType, TransactionHttp
} = require('nem2-sdk')
const account = Account.createFromPrivateKey(
    '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
    NetworkType.MIJIN_TEST
)
const generationHash = '9A7949B3ED05DE9C771B8BEB16226E1CEBCA4C50428F27445796C8B4D9B0A9D6'
const endPoint = 'https://fushicho.48gh23s.xyz:3001'
const transactionHttp = new TransactionHttp(endPoint)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background', request);
    if (request.greeting === "hello") {
        sendResponse({farewell: "goodbye"});
    } else if (request.method === 'sendTransaction') {
        const signed = account.sign(request.data.transaction, generationHash)
        transactionHttp.announce(signed).toPromise().then(
            () => {
                sendResponse({result: 'success', data: {transactionHash: signed.hash}})
            },
            (e) => {
                sendResponse({result: 'fail', data: e})
            }
        )

    }
    return true;
});