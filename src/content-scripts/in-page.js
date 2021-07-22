import { WindowPostMessageStream } from '@metamask/post-message-stream'
import SignatureRequest from '../assets/models/SignatureRequest'
import ModelType from '../assets/models/ModelType'
import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'

console.log('Hello from the inpage')

let contentScriptSubscriber

const observable = new Observable(function subscribe (subscriber) {
  contentScriptSubscriber = subscriber
})

const contentScriptStream = new WindowPostMessageStream({
  name: 'inPage',
  target: 'contentScript'
})

contentScriptStream.on('data', (data) => {
  console.log(data)

  if (!data.type) return

  if (data.type === ModelType.SIGNATURE_RESPONSE) {
    contentScriptSubscriber.next(data)
  }
})

/**
 *
 * @param {string} payload
 */
function sign (payload) {
  return new Promise((resolve, reject) => {
    const subscription = observable
      .pipe(
        filter((data) => data.type === ModelType.SIGNATURE_RESPONSE)
      )
      .subscribe({
        next: (data) => {
          subscription.unsubscribe()
          resolve(data)
        },
        error: (err) => {
          subscription.unsubscribe()
          reject(err)
        }
      })
    contentScriptStream.write(new SignatureRequest(payload))
  }).then((data) => data.payload)
}

window.nem2 = {
  sign
}
