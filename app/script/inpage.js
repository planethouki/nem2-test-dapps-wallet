console.log('inpage loading')

const LocalMessageDuplexStream = require('post-message-stream')

const contentStream = new LocalMessageDuplexStream({
    name: 'zskmgbd0e32f5siy5ua973kqush6xxk5qd0hg3f2',
    target: 'nw6i519ganfrhq8ax05v215txcor9rtk5rpcxcfz',
})

let contentStreamQueue = {}

contentStream.on('data', (data) => {
    const item = contentStreamQueue[data.processId]
    if (item === undefined) {
        return
    }
    if (data.result === 'success') {
        item.resolve(data.data)
    } else {
        item.reject(data.error)
    }
    delete contentStreamQueue[data.processId]
})


window.nem2 = {
    sendTransaction(transaction) {
        const processId = getRandomId()
        contentStream.write({
            method: 'sendTransaction',
            processId,
            data: {payload: transaction.serialize(), name: transaction.constructor.name}
        })
        return new Promise((resolve, reject) => {
            contentStreamQueue[processId] = {
                resolve,
                reject
            }
        })
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

function getRandomId() {
    const min = 0;
    const max = 999999999;
    const random = Math.floor(Math.random() * (max - min)) + min;
    return random.toString() + Date.now().toString()
}