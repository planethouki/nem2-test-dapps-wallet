import { v4 as uuid } from 'uuid'
import { from as ObservableFrom, BehaviorSubject } from 'rxjs'
import nem2 from './assets/utils/nem2'
import ModelType from './assets/models/ModelType'
import hash from './assets/utils/hash'
import helper from './assets/utils/helper'
import SignatureResponse from './assets/models/SignatureResponse'
import BackgroundStore from './assets/background/BackgroundStore'
import BackgroundSignConfirm from './assets/background/BackgroundSignConfirm'
import SignatureDeniedResponse from './assets/models/SignatureDeniedResponse'
import BackgroundSignConfirms from './assets/background/BackgroundSignConfirms'
import AccountInfoDisplayRequest from './assets/models/AccountInfoDisplayRequest'

const popupWindowFeatures = 'location=no, width=400, height=400'

const setBadgeText = (text) => {
  browser.browserAction.setBadgeText({ text })
}

const store = new BackgroundStore(window.localStorage)
const confirms = new BackgroundSignConfirms(setBadgeText)

const isReadySubject = new BehaviorSubject(false)

ObservableFrom(nem2.getProperties(store.getEndPoint()))
  .subscribe(({ generationHash, networkType }) => {
    console.log('background: get network properties', generationHash, networkType)
    store.setNetworkProperties(generationHash, networkType)
    isReadySubject.next(true)
  })

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
    const signature = nem2.sign(store.getPrivateKey(), unsignedPayload, store.getGenerationHash())
    const signerPublicKey = store.getPublicKey()
    const payload = helper.spliceSignature(unsignedPayload, signature, signerPublicKey)
    const txHash = hash.getTransactionHash(payload, store.getGenerationHash())
    const type = helper.getTransactionType(payload)
    const networkType = store.getNetworkType()
    console.log('background: send SIGNATURE_RESPONSE')
    return new SignatureResponse(
      signatureRequest.id,
      payload,
      txHash,
      signerPublicKey,
      type,
      networkType)
  })
}

browser.runtime.onMessage.addListener(function (request, sender) {
  if (!request.type) return

  if (request.type === ModelType.SIGNATURE_REQUEST) {
    return signatureRequestHandler(request)
  }
})

window.nem2 = {
  listenBackgroundIsReady (callback) {
    isReadySubject.subscribe((isReady) => {
      callback(isReady)
    })
  },
  getAccountInfo () {
    return new AccountInfoDisplayRequest(
      uuid(),
      store.getAddress(),
      helper.getNetworkTypeString(store.getNetworkType()))
  },
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
