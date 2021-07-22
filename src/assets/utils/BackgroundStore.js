module.exports = class BackgroundStore {
  localStorage
  badgeCount = 0
  signReqCallbacks = []

  constructor (localStorage) {
    this.localStorage = localStorage
  }

  getBadgeCountText () {
    if (this.badgeCount > 0) {
      return this.badgeCount.toString()
    } else {
      return ''
    }
  }

  incrementBadgeCount () {
    this.badgeCount++
  }

  decrementBadgeCount () {
    this.badgeCount--
  }

  pushSignRequest (callback) {
    this.signReqCallbacks.push(callback)

    setTimeout(() => {
      callback()
    }, 1000)
  }
}
