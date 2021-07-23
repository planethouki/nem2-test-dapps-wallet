const { Subject } = require('rxjs')

module.exports = class BackgroundSignConfirms {
  signReqConfirms = []
  signReqSubject

  constructor (setBadgeText) {
    this.signReqSubject = new Subject()
    this.signReqSubject.subscribe(() => {
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

  hasSignConfirm () {
    return this.signReqConfirms.length > 0
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
}
