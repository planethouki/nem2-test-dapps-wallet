const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')

module.exports = class SettingsSaveRequest extends ModelBase {
  inputEndPoint

  constructor (id, inputNode) {
    super(ModelType.SETTINGS_SAVE_REQUEST, id)
    this.inputEndPoint = inputNode
  }
}
