const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SetUpSaveRequest extends ModelBase {
  inputEncryptedPrivateKey
  inputEndPoint
  inputPassword

  constructor (id, inputEncryptedPrivateKey, inputNode, inputPassword) {
    super(ModelType.SETUP_SAVE_REQUEST, id)
    this.inputEncryptedPrivateKey = inputEncryptedPrivateKey
    this.inputEndPoint = inputNode
    this.inputPassword = inputPassword
  }
}
