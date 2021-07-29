import { v4 as uuid } from 'uuid'
import AccountInfoDisplayRequest from '../models/AccountInfoDisplayRequest'
import helper from '../utils/helper'

export default class PopUpFacade {
  store
  isReadySubject
  signConfirmManager
  updateNetworkProperties

  constructor (store, isReadySubject, confirms, updateNetworkProperties) {
    this.store = store
    this.isReadySubject = isReadySubject
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

  listenBackgroundIsReady (callback) {
    this.isReadySubject.subscribe((isReady) => {
      callback(isReady)
    })
  }

  isBackgroundSetUpFinished () {
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
    if (settingsSaveRequest.existsInputEndPoint) {
      this.store.setEndPoint(settingsSaveRequest.inputEndPoint)
    }
    if (settingsSaveRequest.existsInputEncryptedPrivateKey) {
      this.store.setEncryptedPrivateKey(settingsSaveRequest.inputEncryptedPrivateKey)
    }

    this.updateNetworkProperties()
  }

  getPassword () {
    return this.store.getPassword()
  }
}
