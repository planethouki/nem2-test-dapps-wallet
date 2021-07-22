import Nem2 from './assets/utils/nem2'
import ModelType from './assets/models/ModelType'
import hash from './assets/utils/hash'
import SignatureResponse from './assets/models/SignatureResponse'
import helper from './assets/utils/helper'
import BackgroundStore from './assets/utils/BackgroundStore'

const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
const generationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
// const endPoint = 'https://dg0nbr5d1ohfy.cloudfront.net:443'
const popupWindowFeatures = 'location=no, width=400, height=300'

const nem2 = new Nem2(privateKey)

const store = new BackgroundStore(window.localStorage)

function signatureRequestHandler (request) {
  console.log('background: receive SIGNATURE_REQUEST')
  browser.browserAction.getPopup({}).then((url) => {
    window.open(url, '', popupWindowFeatures)
  })
  store.incrementBadgeCount()
  browser.browserAction.setBadgeText({
    text: store.getBadgeCountText()
  })
  return new Promise((resolve, reject) => {
    const callback = (err, data) => {
      if (err) return reject(err)
      else resolve(data)
    }
    store.pushSignRequest(callback)
  }).then(() => {
    const unsignedPayload = request.payload
    const signature = nem2.sign(unsignedPayload, generationHash)
    const signerPublicKey = nem2.getPublicKey()
    const payload = helper.getForwardPayload(unsignedPayload) +
      signature +
      signerPublicKey +
      helper.getSigningPayload(unsignedPayload)
    const txHash = hash.getTransactionHash(payload, generationHash)
    console.log('background: send SIGNATURE_RESPONSE')
    return new SignatureResponse(request.id, payload, txHash, signerPublicKey)
  })
}

browser.runtime.onMessage.addListener(function (request, sender) {
  console.log('Hello from the background')

  // browser.tabs.executeScript({
  //   file: 'js/content-script.js'
  // })

  if (!request.type) return

  if (request.type === ModelType.SIGNATURE_REQUEST) {
    return signatureRequestHandler(request)
  }
})

window.hoge = nem2.getPublicKey()
