import { v4 as uuid } from 'uuid'
import AccountInfoForPopUp from '../models/AccountInfoForPopUp'
import helper from '../utils/helper'
import BackgroundStateType from '../models/BackgroundStateType'
import BackgroundStateInfo from '../models/BackgroundStateInfo'

export default class PopUpFacade {
  store
  signConfirmManager
  invokeLoading

  constructor (store, confirms, invokeLoading, backgroundStateSubject) {
    this.store = store
    this.backgroundStateSubject = backgroundStateSubject
    this.invokeLoading = invokeLoading
    this.signConfirmManager = {
      firstMessage () {
        return confirms.getFirstMessage()
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

  getAccountInfo () {
    return new AccountInfoForPopUp(
      uuid(),
      this.store.getAddress(),
      helper.getNetworkTypeString(this.store.getNetworkType()),
      this.store.getEndPoint())
  }

  setEndPoint (endPoint) {
    this.store.setEndPoint(endPoint)
    this.invokeLoading()
  }

  setSettings (settingsSaveRequest) {
    this.store.setEndPoint(settingsSaveRequest.inputEndPoint)
    this.invokeLoading()
  }

  setUp (setUpSaveRequest) {
    this.store.setUp(
      setUpSaveRequest.encryptedPrivateKey,
      setUpSaveRequest.inputEndPoint,
      setUpSaveRequest.inputPassword,
      setUpSaveRequest.publicKey,
      setUpSaveRequest.passwordHash
    )
    this.invokeLoading()
  }

  setPassword (password) {
    this.store.setPassword(password)
    this.backgroundStateSubject.next(new BackgroundStateInfo(BackgroundStateType.READY))
  }

  equalsPasswordHash (passwordHash) {
    return this.store.equalsPasswordHash(passwordHash)
  }

  getEndPoint () {
    return this.store.getEndPoint()
  }

  factorySet () {
    this.store.factorySet()
    this.invokeLoading()
  }
}
