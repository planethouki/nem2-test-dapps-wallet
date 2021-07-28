import { v4 as uuid } from 'uuid'
import AccountInfoDisplayRequest from '../models/AccountInfoDisplayRequest'
import helper from '../utils/helper'

export default class PopUpFacade {
  store
  isReadySubject
  signConfirm
  updateNetworkProperties

  constructor (store, isReadySubject, confirms, updateNetworkProperties) {
    this.store = store
    this.isReadySubject = isReadySubject
    this.updateNetworkProperties = updateNetworkProperties
    this.signConfirm = {
      has () {
        return confirms.hasSignConfirm()
      },
      firstMessage () {
        return 'hoge'
      },
      addListener (callback) {
        return confirms.addSignConfirmListener(callback)
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

    this.isReadySubject.next(false)
    this.updateNetworkProperties()
  }

  getPassword () {
    return this.store.getPassword()
  }
}
