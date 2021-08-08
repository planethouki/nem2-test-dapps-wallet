const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class AccountInfoForPopUp extends ModelBase {
  constructor (id, addressPlain, networkName, endPoint) {
    super(ModelType.ACCOUNT_INFO_FOR_POPUP, id)
    this.addressPlain = addressPlain
    this.networkName = networkName
    this.endPoint = endPoint
  }
}
