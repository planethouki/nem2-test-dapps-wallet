const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class SignatureResponse extends ModelBase {
  /**
   *
   * @param {string} payload
   * @param {string} hash
   * @param {string} signerPublicKey
   */
  constructor (payload, hash, signerPublicKey) {
    super(ModelType.SIGNATURE_RESPONSE)
    this.payload = payload
    this.hash = hash
    this.signerPublicKey = signerPublicKey
  }
}
