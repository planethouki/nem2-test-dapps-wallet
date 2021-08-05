import ModelType from '../ModelType'
import ModelBase from '../ModelBase'

export default class BackgroundWaitPasswordInfo extends ModelBase {
  constructor (id) {
    super(ModelType.BACKGROUND_WAIT_PASSWORD, id)
  }
}
