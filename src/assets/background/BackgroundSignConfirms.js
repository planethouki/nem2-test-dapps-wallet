import PropertiesChangedError from '../Errors/PropertiesChangedError'

const { BehaviorSubject } = require('rxjs')

export default class BackgroundSignConfirms {
  signReqConfirms = []
  signReqSubject

  constructor (setBadgeText) {
    this.signReqSubject = new BehaviorSubject(0)
    this.signReqSubject.subscribe((length) => {
      setBadgeText(this.getBadgeCountText())
    })
  }

  getBadgeCountText () {
    const count = this.signReqConfirms.length
    if (count > 0) {
      return count.toString()
    } else {
      return ''
    }
  }

  pushSignConfirm (confirm) {
    this.signReqConfirms.push(confirm)
    this.signReqSubject.next(this.signReqConfirms.length)
  }

  getFirstMessage () {
    return this.signReqConfirms[0].message
  }

  firstOk () {
    this.signReqConfirms[0].ok()
    this.signReqConfirms.shift()
    this.signReqSubject.next(this.signReqConfirms.length)
  }

  firstCancel () {
    this.signReqConfirms[0].cancel()
    this.signReqConfirms.shift()
    this.signReqSubject.next(this.signReqConfirms.length)
  }

  addSignConfirmListener (callback) {
    this.signReqSubject.subscribe(callback)
  }

  clear () {
    this.signReqConfirms.forEach(confirm => {
      confirm.throw(new PropertiesChangedError())
    })
    this.signReqConfirms = []
    this.signReqSubject.next(0)
  }
}
