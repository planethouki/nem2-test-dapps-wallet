import { WindowPostMessageStream } from '@metamask/post-message-stream'
import ModelType from '../assets/models/ModelType'

console.log('Hello from the content-script')

function injectScript () {
  try {
    const c = document.head || document.documentElement
    const s = document.createElement('script')
    s.setAttribute('async', false)
    s.setAttribute('type', 'text/javascript')
    s.setAttribute('src', browser.runtime.getURL('js/in-page.js'))
    // c.insertBefore(s, c.children[0])
    // c.removeChild(s)
    c.appendChild(s)
  } catch (e) {
    console.error('injection failed', e)
  }
}

const stream = new WindowPostMessageStream({
  name: 'contentScript',
  target: 'inPage'
})

injectScript()

stream.on('data', (data) => {
  if (!data.type) return

  if (data.type === ModelType.SIGNATURE_REQUEST) {
    console.log('content-script: receive SIGNATURE_REQUEST')
    browser.runtime.sendMessage(data).then((res) => {
      console.log('content-script: receive SIGNATURE_RESPONSE')
      stream.write(res)
    })
  }
})

browser.runtime.onMessage.addListener(function (request, sender) {
  if (!request.type) return

  if (request.type === ModelType.SIGNATURE_RESPONSE) {
    console.log('content-script: receive SIGNATURE_RESPONSE')
    stream.write(request)
  }
})
