import ModelType from '../ModelType'
import ModelBase from '../ModelBase'

export default class BackgroundLoadingInfo extends ModelBase {
  constructor (id) {
    super(ModelType.BACKGROUND_LOADING, id)
  }
}
