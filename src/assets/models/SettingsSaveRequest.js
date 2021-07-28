const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SettingsSaveRequest extends ModelBase {
  inputEncryptedPrivateKey
  inputEndPoint

  existsInputEncryptedPrivateKey = false
  existsInputEndPoint = false

  constructor (id, inputEncryptedPrivateKey, inputNode) {
    super(ModelType.SETTINGS_SAVE_REQUEST, id)
    this.existsInputEncryptedPrivateKey = !!inputEncryptedPrivateKey
    if (this.existsInputEncryptedPrivateKey) {
      this.inputEncryptedPrivateKey = inputEncryptedPrivateKey
    }
    this.existsInputEndPoint = !!inputNode
    if (this.existsInputEndPoint) {
      this.inputEndPoint = inputNode
    }
  }
}
