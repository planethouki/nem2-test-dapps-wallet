const LocalMessageDuplexStream = require('post-message-stream')

const contentStream = new LocalMessageDuplexStream({
    name: 'inpage',
    target: 'contentscript',
})

contentStream.on('data', (data) => {
    console.log('contentStream', data)
})

contentStream.write({ greeting: 'hello' })

window.nem2 = {
    sendTransaction(transaction) {
        console.log('sendTransaction')
        contentStream.write({ function: 'sendTransaction', data: {transaction} })
    },
    address() {
        console.log('address')
    },
    networkType() {
        console.log('networkType')
    },
    generationHash() {
        console.log('generationHash')
    }
}