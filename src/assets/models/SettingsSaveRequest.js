const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class SettingsSaveRequest extends ModelBase {
  constructor (id, inputPrivateKey, inputNode) {
    super(ModelType.SETTINGS_SAVE_REQUEST, id)
    this.inputPrivateKey = inputPrivateKey
    this.inputEndPoint = inputNode
  }
}
