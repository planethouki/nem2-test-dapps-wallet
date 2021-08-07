const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SignatureRequest extends ModelBase {
  /**
   *
   * @param {string} id
   * @param {string} payload
   * @param {string} message
   */
  constructor (id, payload, message) {
    super(ModelType.SIGNATURE_REQUEST, id)
    this.payload = payload
    this.message = message
  }
}
