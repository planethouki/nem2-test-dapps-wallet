import { BehaviorSubject } from 'rxjs'
import account from './assets/utils/account'
import network from './assets/utils/network'
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
import CosignatureResponse from './assets/models/CosignatureResponse'
import CosignatureDeniedResponse from './assets/models/CosignatureDeniedResponse'

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
  return network.getProperties(store.getEndPoint())
    .then(({ generationHash, networkType, rawData }) => {
      console.log('background: get network properties', generationHash, networkType)
      const hexAddress = hash.publicKeyToHexAddress(store.getPublicKey(), networkType)
      const plainAddress = base32.getBase32EncodeAddress(hexAddress)
      store.setNetworkProperties(generationHash, networkType, plainAddress, rawData)
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
    const signature = account.sign(crypto.decrypt(store.getEncryptedPrivateKey(),
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

function cosignatureRequestHandler (cosignatureRequest) {
  console.log('background: receive COSIGNATURE_REQUEST')
  return browser.browserAction.getPopup({}).then((url) => {
    const popupWindowProxy = window.open(url, '', popupWindowFeatures)
    return new Promise((resolve, reject) => {
      confirms.pushSignConfirm(new BackgroundSignConfirm(resolve, reject, popupWindowProxy, cosignatureRequest.message))
    })
  }).then((isOk) => {
    if (!isOk) {
      console.log('background: send COSIGNATURE_DENIED_RESPONSE')
      return new CosignatureDeniedResponse(cosignatureRequest.id)
    }
    const txHash = hash.getTransactionHash(cosignatureRequest.payload, store.getGenerationHash())
    const cosignature = account.cosign(
      crypto.decrypt(store.getEncryptedPrivateKey(),
        store.getPassword()),
      txHash
    )
    const signerPublicKey = store.getPublicKey()
    const address = store.getAddress()
    const networkType = store.getNetworkType()
    console.log('background: send COSIGNATURE_RESPONSE')
    return new CosignatureResponse(
      cosignatureRequest.id,
      cosignature,
      signerPublicKey,
      address,
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
        const networkProperties = store.getRawDataOfRestNetworkProperties()
        console.log('background: send ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE')
        resolve(new AccountInfoForInPageResponse(
          accountInfoRequest.id,
          address,
          publicKey,
          networkType,
          generationHash,
          networkProperties
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
  } else if (request.type === ModelType.COSIGNATURE_REQUEST) {
    return cosignatureRequestHandler(request)
  }
})

window.nem2 = new PopUpFacade(
  store,
  confirms,
  updateNetworkProperties,
  backgroundStateSubject)
