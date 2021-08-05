import ModelType from '../ModelType'
import ModelBase from '../ModelBase'

export default class BackgroundLoadErrorInfo extends ModelBase {
  constructor (id) {
    super(ModelType.BACKGROUND_LOAD_ERROR, id)
  }
}
