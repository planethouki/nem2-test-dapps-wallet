const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class CosignatureDeniedResponse extends ModelBase {
  /**
   *
   * @param {string} id
   */
  constructor (id) {
    super(ModelType.COSIGNATURE_DENIED_RESPONSE, id)
  }
}
