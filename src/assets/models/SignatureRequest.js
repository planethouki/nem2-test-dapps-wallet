const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SignatureRequest extends ModelBase {
  /**
   *
   * @param {string} id
   * @param {string} payload
   */
  constructor (id, payload) {
    super(ModelType.SIGNATURE_REQUEST, id)
    this.payload = payload
  }
}
