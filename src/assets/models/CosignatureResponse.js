const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class CosignatureResponse extends ModelBase {
  /**
   *
   * @param {string} id
   * @param {string} cosignature
   * @param {string} signerPublicKey
   * @param {string} address
   * @param {number} networkType
   */
  constructor (id, cosignature, signerPublicKey, address, networkType) {
    super(ModelType.COSIGNATURE_RESPONSE, id)
    this.cosignature = cosignature
    this.signerPublicKey = signerPublicKey
    this.address = address
    this.networkType = networkType
  }
}
