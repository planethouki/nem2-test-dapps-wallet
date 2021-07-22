module.exports = class BackgroundSignConfirm {
  resolve
  reject
  popupWindowProxy

  constructor (resolve, reject, popupWindowProxy) {
    this.resolve = resolve
    this.reject = reject
    this.popupWindowProxy = popupWindowProxy
  }

  ok () {
    this.popupWindowProxy.close()
    this.resolve()
  }

  cancel () {
    this.popupWindowProxy.close()
    this.reject()
  }
}
