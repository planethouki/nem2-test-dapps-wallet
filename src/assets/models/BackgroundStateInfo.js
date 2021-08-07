import ModelType from './ModelType'
import ModelBase from './ModelBase'
import { v4 as uuid } from 'uuid'

export default class BackgroundStateInfo extends ModelBase {
  constructor (stateType) {
    super(ModelType.BACKGROUND_STATE, uuid())
    this.type = stateType
  }
}
