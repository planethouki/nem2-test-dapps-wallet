import { WindowPostMessageStream } from '@metamask/post-message-stream'
import ModelType from '../assets/models/ModelType'

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
    console.log('content-script: transfer SIGNATURE_REQUEST')
    browser.runtime.sendMessage(data).then((res) => {
      console.log('content-script: transfer SIGNATURE_(DENIED_)RESPONSE')
      stream.write(res)
    })
  } else if (data.type === ModelType.ACCOUNT_INFO_FOR_IN_PAGE_REQUEST) {
    console.log('content-script: transfer ACCOUNT_INFO_FOR_IN_PAGE_REQUEST')
    browser.runtime.sendMessage(data).then((res) => {
      console.log('content-script: transfer ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE')
      stream.write(res)
    })
  } else if (data.type === ModelType.COSIGNATURE_REQUEST) {
    console.log('content-script: transfer COSIGNATURE_REQUEST')
    browser.runtime.sendMessage(data).then((res) => {
      console.log('content-script: transfer COSIGNATURE_(DENIED_)RESPONSE')
      stream.write(res)
    })
  }
})
