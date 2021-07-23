const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class SignatureResponse extends ModelBase {
  /**
   *
   * @param {string} id
   * @param {string} payload
   * @param {string} hash
   * @param {string} signerPublicKey
   * @param {number} transactionType
   * @param {number} networkType
   */
  constructor (id, payload, hash, signerPublicKey, transactionType, networkType) {
    super(ModelType.SIGNATURE_RESPONSE, id)
    this.payload = payload
    this.hash = hash
    this.signerPublicKey = signerPublicKey
    this.transactionType = transactionType
    this.networkType = networkType
  }
}
