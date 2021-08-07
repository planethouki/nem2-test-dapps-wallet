export default class BackgroundSignConfirm {
  resolve
  reject
  popupWindowProxy

  constructor (resolve, reject, popupWindowProxy, message) {
    this.resolve = resolve
    this.reject = reject
    this.popupWindowProxy = popupWindowProxy
    this.message = message
  }

  ok () {
    this.popupWindowProxy.close()
    this.resolve(true)
  }

  cancel () {
    this.popupWindowProxy.close()
    this.resolve(false)
  }

  throw (err) {
    this.reject(err)
  }
}
