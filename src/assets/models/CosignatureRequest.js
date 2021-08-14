const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class CosignatureRequest extends ModelBase {
  /**
   *
   * @param {string} id
   * @param {string} payload
   * @param {string} message
   */
  constructor (id, payload, message) {
    super(ModelType.COSIGNATURE_REQUEST, id)
    this.payload = payload
    this.message = message
  }
}
