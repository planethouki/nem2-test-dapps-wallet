const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class AccountInfoForInPageResponse extends ModelBase {
  constructor (id, addressPlain, publicKey, networkType, generationHash, networkProperties) {
    super(ModelType.ACCOUNT_INFO_FOR_IN_PAGE_RESPONSE, id)
    this.addressPlain = addressPlain
    this.publicKey = publicKey
    this.networkType = networkType
    this.generationHash = generationHash
    this.networkProperties = networkProperties
  }
}
