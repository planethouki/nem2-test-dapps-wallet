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
    sign(transaction) {
        console.log('sign')
        contentStream.write({ function: 'sign', data: {transaction} })
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