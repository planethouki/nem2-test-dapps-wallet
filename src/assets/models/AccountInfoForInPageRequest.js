const ModelType = require('./ModelType')
const ModelBase = require('./ModelBase')
module.exports = class AccountInfoForInPageRequest extends ModelBase {
  constructor (id) {
    super(ModelType.ACCOUNT_INFO_FOR_IN_PAGE_REQUEST, id)
  }
}
