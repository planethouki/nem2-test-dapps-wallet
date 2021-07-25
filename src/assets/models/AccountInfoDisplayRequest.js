const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class AccountInfoDisplayRequest extends ModelBase {
  constructor (id, addressPlain, networkName) {
    super(ModelType.ACCOUNT_INFO_RESPONSE, id)
    this.addressPlain = addressPlain
    this.networkName = networkName
  }
}
