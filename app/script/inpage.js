const LocalMessageDuplexStream = require('post-message-stream')

console.log("inpage")

const contentStream = new LocalMessageDuplexStream({
    name: 'inpage',
    target: 'contentscript',
})


contentStream.on('data', (data) => {
    console.log('contentStream', data)
})

contentStream.write({ greeting: 'hello' })