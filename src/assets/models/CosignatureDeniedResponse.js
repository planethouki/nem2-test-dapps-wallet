const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class SignatureDeniedResponse extends ModelBase {
  /**
   *
   * @param {string} id
   */
  constructor (id) {
    super(ModelType.SIGNATURE_DENIED_RESPONSE, id)
  }
}
