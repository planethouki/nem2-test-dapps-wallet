import { BehaviorSubject } from 'rxjs'
import nem2 from './assets/utils/nem2'
import ModelType from './assets/models/ModelType'
import hash from './assets/utils/hash'
import base32 from './assets/utils/base32'
import helper from './assets/utils/helper'
import crypto from './assets/utils/crypto'
import SignatureResponse from './assets/models/SignatureResponse'
import BackgroundStore from './assets/background/BackgroundStore'
import BackgroundSignConfirm from './assets/background/BackgroundSignConfirm'
import SignatureDeniedResponse from './assets/models/SignatureDeniedResponse'
import BackgroundSignConfirms from './assets/background/BackgroundSignConfirms'
import PopUpFacade from './assets/background/PopUpFacade'
import BackgroundStateInfo from './assets/models/BackgroundStateInfo'
import BackgroundStateType from './assets/models/BackgroundStateType'
import AccountInfoForInPageResponse from './assets/models/AccountInfoForInPageResponse'

const popupWindowFeatures = 'location=no, width=400, height=400'

const setBadgeText = (text) => {
  browser.browserAction.setBadgeText({ text })
}

const backgroundStateSubject = new BehaviorSubject(new BackgroundStateInfo(BackgroundStateType.LOADING))
const store = new BackgroundStore(window.localStorage)
const confirms = new BackgroundSignConfirms(setBadgeText)

const updateNetworkProperties = () => {
  console.log('background: update network properties')
  confirms.clear()
  if (!store.isSetUpFinished()) {
    backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.BEFORE_SETUP))
    return Promise.resolve()
  }
  backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.LOADING))
  return nem2.getProperties(store.getEndPoint())
    .then(({ generationHash, networkType }) => {
      console.log('background: get network properties', generationHash, networkType)
      const hexAddress = hash.publicKeyToHexAddress(store.getPublicKey(), networkType)
      const plainAddress = base32.getBase32EncodeAddress(hexAddress)
      store.setNetworkProperties(generationHash, networkType, plainAddress)
      if (store.hasPassword()) {
        backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.READY))
      } else {
        backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.WAIT_PASSWORD))
      }
    })
    .catch((e) => {
      backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.LOAD_ERROR))
    })
}

updateNetworkProperties()

function signatureRequestHandler (signatureRequest) {
  console.log('background: receive SIGNATURE_REQUEST')
  return browser.browserAction.getPopup({}).then((url) => {
    const popupWindowProxy = window.open(url, '', popupWindowFeatures)
    return new Promise((resolve, reject) => {
      confirms.pushSignConfirm(new BackgroundSignConfirm(resolve, reject, popupWindowProxy, signatureRequest.message))
    })
  }).then((isOk) => {
    if (!isOk) {
      console.log('background: send SIGNATURE_DENIED_RESPONSE')
      return new SignatureDeniedResponse(signatureRequest.id)
    }
    const unsignedPayload = signatureRequest.payload
    const signature = nem2.sign(crypto.decrypt(store.getEncryptedPrivateKey(),
      store.getPassword()), unsignedPayload, store.getGenerationHash())
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

function accountInfoRequestHandler (accountInfoRequest) {
  console.log('background: receive ACCOUNT_INFO_FOR_IN_PAGE_REQUEST')

  return new Promise((resolve, reject) => {
    backgroundStateSubject.subscribe({
      next (stateInfo) {
        if (store.isSetUpFinished() === false) {
          return
        }
        const isWait = stateInfo.type === BackgroundStateType.WAIT_PASSWORD
        const isReady = stateInfo.type === BackgroundStateType.READY
        if ((isWait || isReady) === false) {
          return
        }
        const networkType = store.getNetworkType()
        const generationHash = store.getGenerationHash()
        const publicKey = store.getPublicKey()
        const address = store.getAddress()
        console.log('background: send ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE')
        resolve(new AccountInfoForInPageResponse(
          accountInfoRequest.id,
          address,
          publicKey,
          networkType,
          generationHash
        ))
      },
      error (err) {
        reject(err)
      }
    })
  })
}

browser.runtime.onMessage.addListener(function (request, sender) {
  if (!request.type) return

  if (request.type === ModelType.SIGNATURE_REQUEST) {
    return signatureRequestHandler(request)
  } else if (request.type === ModelType.ACCOUNT_INFO_FOR_IN_PAGE_REQUEST) {
    return accountInfoRequestHandler(request)
  }
})

window.nem2 = new PopUpFacade(
  store,
  confirms,
  updateNetworkProperties,
  backgroundStateSubject)
