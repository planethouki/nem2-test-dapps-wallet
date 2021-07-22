const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SignatureRequest extends ModelBase {
  /**
   *
   * @param {string} payload
   */
  constructor (payload) {
    super(ModelType.SIGNATURE_REQUEST)
    this.payload = payload
  }
}
