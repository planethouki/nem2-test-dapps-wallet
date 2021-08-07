import { v4 as uuid } from 'uuid'
import AccountInfoDisplayRequest from '../models/AccountInfoDisplayRequest'
import helper from '../utils/helper'
import BackgroundStateType from '../models/BackgroundStateType'
import BackgroundStateInfo from '../models/BackgroundStateInfo'

export default class PopUpFacade {
  store
  signConfirmManager
  updateNetworkProperties

  constructor (store, confirms, updateNetworkProperties, backgroundStateSubject) {
    this.store = store
    this.backgroundStateSubject = backgroundStateSubject
    this.updateNetworkProperties = updateNetworkProperties
    this.signConfirmManager = {
      hasSignConfirm () {
        return confirms.hasSignConfirm()
      },
      firstMessage () {
        return 'hoge'
      },
      addListener (callback) {
        confirms.addSignConfirmListener(callback)
      },
      firstOk () {
        confirms.firstOk()
      },
      firstCancel () {
        confirms.firstCancel()
      }
    }
  }

  listenBackgroundState (callback) {
    this.backgroundStateSubject.subscribe((stateInfo) => {
      callback(stateInfo)
    })
  }

  getIsBackgroundSetUpFinished () {
    return this.store.isSetUpFinished()
  }

  getAccountInfo () {
    return new AccountInfoDisplayRequest(
      uuid(),
      this.store.getAddress(),
      helper.getNetworkTypeString(this.store.getNetworkType()),
      this.store.getEndPoint())
  }

  setSettings (settingsSaveRequest) {
    this.store.setSettings(settingsSaveRequest.inputEndPoint)

    this.updateNetworkProperties()
  }

  setUp (setUpSaveRequest) {
    this.store.setUp(
      setUpSaveRequest.encryptedPrivateKey,
      setUpSaveRequest.inputEndPoint,
      setUpSaveRequest.inputPassword,
      setUpSaveRequest.publicKey,
      setUpSaveRequest.passwordHash
    )
    this.updateNetworkProperties()
  }

  getHasPassword () {
    return this.store.hasPassword()
  }

  setPassword (password) {
    this.store.setPassword(password)
    this.backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.BACKGROUND_READY))
  }

  equalsPasswordHash (passwordHash) {
    return this.store.equalsPasswordHash(passwordHash)
  }

  getEndPoint () {
    return this.store.getEndPoint()
  }
}
