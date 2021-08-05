import ModelType from '../ModelType'
import ModelBase from '../ModelBase'

export default class BackgroundReadyInfo extends ModelBase {
  constructor (id) {
    super(ModelType.BACKGROUND_READY, id)
  }
}
