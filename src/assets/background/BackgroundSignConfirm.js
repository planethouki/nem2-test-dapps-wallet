export default class BackgroundSignConfirm {
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
    this.resolve(true)
  }

  cancel () {
    this.popupWindowProxy.close()
    this.resolve(false)
  }
}
