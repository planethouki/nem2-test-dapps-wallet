const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SetUpSaveRequest extends ModelBase {
  encryptedPrivateKey
  inputEndPoint
  inputPassword
  publicKey

  constructor (id, encryptedPrivateKey, inputNode, inputPassword, publicKey) {
    super(ModelType.SETUP_SAVE_REQUEST, id)
    this.encryptedPrivateKey = encryptedPrivateKey
    this.inputEndPoint = inputNode
    this.inputPassword = inputPassword
    this.publicKey = publicKey
  }
}
