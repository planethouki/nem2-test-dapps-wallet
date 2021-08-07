import { WindowPostMessageStream } from '@metamask/post-message-stream'
import SignatureRequest from '../assets/models/SignatureRequest'
import ModelType from '../assets/models/ModelType'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'
import UserDeniedSignatureError from '../assets/Errors/UserDeniedSignatureError'
import UnknownError from '../assets/Errors/UnknownError'

const modelSubject = new Subject()

const contentScriptStream = new WindowPostMessageStream({
  name: 'inPage',
  target: 'contentScript'
})

contentScriptStream.on('data', (data) => {
  console.log('in-page: receive data', data)

  if (!data.type) return

  if (data.type === ModelType.SIGNATURE_RESPONSE) {
    modelSubject.next(data)
  } else if (data.type === ModelType.SIGNATURE_DENIED_RESPONSE) {
    modelSubject.next(data)
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

window.nem2 = {
  sign
}
