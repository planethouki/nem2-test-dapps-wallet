module.exports = class BackgroundSignConfirm {
  resolve
  reject

  constructor (resolve, reject) {
    this.resolve = resolve
    this.reject = reject
  }

  ok () {
    this.resolve()
  }

  cancel () {
    this.reject()
  }
}
