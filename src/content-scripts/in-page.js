import { WindowPostMessageStream } from '@metamask/post-message-stream'
import SignatureRequest from '../assets/models/SignatureRequest'
import ModelType from '../assets/models/ModelType'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'

console.log('Hello from the inpage')

const subject = new Subject()

const contentScriptStream = new WindowPostMessageStream({
  name: 'inPage',
  target: 'contentScript'
})

contentScriptStream.on('data', (data) => {
  console.log(data)

  if (!data.type) return

  if (data.type === ModelType.SIGNATURE_RESPONSE) {
    subject.next(data)
  }
})

/**
 *
 * @param {string} payload
 */
function sign (payload) {
  const id = uuid()
  return new Promise((resolve, reject) => {
    const subscription = subject
      .pipe(
        filter((data) => data.type === ModelType.SIGNATURE_RESPONSE),
        filter((data) => data.id === id)
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
    contentScriptStream.write(new SignatureRequest(id, payload))
  })
}

window.nem2 = {
  sign
}
