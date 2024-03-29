import { WindowPostMessageStream } from '@metamask/post-message-stream'
import SignatureRequest from '../assets/models/SignatureRequest'
import ModelType from '../assets/models/ModelType'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'
import UserDeniedSignatureError from '../assets/errors/UserDeniedSignatureError'
import UnknownError from '../assets/errors/UnknownError'
import AccountInfoForInPageRequest from '../assets/models/AccountInfoForInPageRequest'
import CosignatureRequest from '../assets/models/CosignatureRequest'
import UserDeniedCosignatureError from '../assets/errors/UserDeniedCosignatureError'

const modelSubject = new Subject()

const contentScriptStream = new WindowPostMessageStream({
  name: 'inPage',
  target: 'contentScript'
})

contentScriptStream.on('data', (data) => {
  console.log('in-page: receive data', data)

  if (!data.type) return

  switch (data.type) {
    case ModelType.SIGNATURE_RESPONSE:
    case ModelType.SIGNATURE_DENIED_RESPONSE:
    case ModelType.ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE:
    case ModelType.COSIGNATURE_RESPONSE:
    case ModelType.COSIGNATURE_DENIED_RESPONSE:
      modelSubject.next(data)
      break
    default:
      console.log('in-page: receive unknown data type')
  }
})

/**
 *
 * @param {string} payload
 * @param {string} message
 */
function sign (payload, message = '') {
  const id = uuid()
  return new Promise((resolve, reject) => {
    const subscription = modelSubject
      .pipe(
        filter((data) => !!data.type),
        filter((data) => data.id === id)
      )
      .subscribe({
        next: (data) => {
          subscription.unsubscribe()
          if (data.type === ModelType.SIGNATURE_RESPONSE) {
            resolve({
              payload: data.payload,
              hash: data.hash,
              signerPublicKey: data.signerPublicKey,
              type: data.transactionType,
              networkType: data.networkType
            })
          } else if (data.type === ModelType.SIGNATURE_DENIED_RESPONSE) {
            const error = new UserDeniedSignatureError()
            reject(error)
          } else {
            const error = new UnknownError()
            reject(error)
          }
        },
        error: (err) => {
          subscription.unsubscribe()
          reject(err)
        }
      })
    contentScriptStream.write(new SignatureRequest(id, payload, message))
  })
}

/**
 *
 * @param {string} payload
 * @param {string} message
 */
function cosign (payload, message = '') {
  const id = uuid()
  return new Promise((resolve, reject) => {
    const subscription = modelSubject
      .pipe(
        filter((data) => !!data.type),
        filter((data) => data.id === id)
      )
      .subscribe({
        next: (data) => {
          subscription.unsubscribe()
          if (data.type === ModelType.COSIGNATURE_RESPONSE) {
            resolve({
              signature: data.cosignature,
              signer: {
                publicKey: data.signerPublicKey,
                address: {
                  address: data.address,
                  networkType: data.networkType
                }
              },
              version: { lower: 0, higher: 0 }
            })
          } else if (data.type === ModelType.COSIGNATURE_DENIED_RESPONSE) {
            const error = new UserDeniedCosignatureError()
            reject(error)
          } else {
            const error = new UnknownError()
            reject(error)
          }
        },
        error: (err) => {
          subscription.unsubscribe()
          reject(err)
        }
      })
    contentScriptStream.write(new CosignatureRequest(id, payload, message))
  })
}

function getAccountInfo () {
  const id = uuid()
  return new Promise((resolve, reject) => {
    const subscription = modelSubject
      .pipe(
        filter((data) => !!data.type),
        filter((data) => data.id === id)
      )
      .subscribe({
        next: (data) => {
          subscription.unsubscribe()
          if (data.type === ModelType.ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE) {
            resolve({
              addressPlain: data.addressPlain,
              publicKey: data.publicKey,
              networkType: data.networkType,
              generationHash: data.generationHash,
              epochAdjustment: data.epochAdjustment,
              currencyMosaicId: data.currencyMosaicId,
              harvestingMosaicId: data.harvestingMosaicId,
              networkProperties: data.networkProperties
            })
          } else {
            const error = new UnknownError()
            reject(error)
          }
        },
        error: (err) => {
          subscription.unsubscribe()
          reject(err)
        }
      })
    contentScriptStream.write(new AccountInfoForInPageRequest(id))
  })
}

window.nem2 = {
  sign,
  cosign,
  getAccountInfo
}
