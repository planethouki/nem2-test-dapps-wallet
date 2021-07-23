import Nem2 from './assets/utils/nem2'
import ModelType from './assets/models/ModelType'
import hash from './assets/utils/hash'
import SignatureResponse from './assets/models/SignatureResponse'
import helper from './assets/utils/helper'
import BackgroundStore from './assets/background/BackgroundStore'
import BackgroundSignConfirm from './assets/background/BackgroundSignConfirm'
import SignatureDeniedResponse from './assets/models/SignatureDeniedResponse'
import BackgroundSignConfirms from './assets/background/BackgroundSignConfirms'

const popupWindowFeatures = 'location=no, width=400, height=400'

const setBadgeText = (text) => {
  browser.browserAction.setBadgeText({ text })
}

const store = new BackgroundStore(window.localStorage)
const confirms = new BackgroundSignConfirms(setBadgeText)
const nem2 = new Nem2(store.getPrivateKey())

function signatureRequestHandler (signatureRequest) {
  console.log('background: receive SIGNATURE_REQUEST')
  return browser.browserAction.getPopup({}).then((url) => {
    const popupWindowProxy = window.open(url, '', popupWindowFeatures)
    return new Promise((resolve, reject) => {
      confirms.pushSignConfirm(new BackgroundSignConfirm(resolve, reject, popupWindowProxy))
    })
  }).then((isOk) => {
    if (!isOk) {
      console.log('background: send SIGNATURE_DENIED_RESPONSE')
      return new SignatureDeniedResponse(signatureRequest.id)
    }
    const unsignedPayload = signatureRequest.payload
    const signature = nem2.sign(unsignedPayload, store.getGenerationHash)
    const signerPublicKey = nem2.getPublicKey()
    const payload = helper.spliceSignedPayload(unsignedPayload, signature, signerPublicKey)
    const txHash = hash.getTransactionHash(payload, store.getGenerationHash)
    console.log('background: send SIGNATURE_RESPONSE')
    return new SignatureResponse(signatureRequest.id, payload, txHash, signerPublicKey)
  })
}

browser.runtime.onMessage.addListener(function (request, sender) {
  if (!request.type) return

  if (request.type === ModelType.SIGNATURE_REQUEST) {
    return signatureRequestHandler(request)
  }
})

window.nem2 = {
  signConfirm: {
    has () {
      return confirms.hasSignConfirm()
    },
    firstMessage () {
      return 'hoge'
    },
    addListener (callback) {
      return confirms.addSignConfirmListener(callback)
    },
    firstOk () {
      confirms.firstOk()
    },
    firstCancel () {
      confirms.firstCancel()
    }
  }
}
