const SETUP_FINISHED = 'SETUP_FINISHED'
const END_POINT = 'END_POINT'
const PUBLIC_KEY = 'PUBLIC_KEY'
const ENCRYPTED_PRIVATE_KEY = 'ENCRYPTED_PRIVATE_KEY'

export default class BackgroundStore {
  localStorage
  setUpFinished = false
  generationHashMemory
  networkTypeMemory
  endPoint
  publicKey
  address
  passwordMemory
  encryptedPrivateKey

  constructor (localStorage) {
    this.localStorage = localStorage
    if (localStorage.getItem(SETUP_FINISHED) === null) {
      return
    }

    this.setUpFinished = true

    this.endPoint = localStorage.getItem(END_POINT)
    this.publicKey = localStorage.getItem(PUBLIC_KEY)
    this.encryptedPrivateKey = localStorage.getItem(ENCRYPTED_PRIVATE_KEY)
  }

  isSetUpFinished () {
    return this.setUpFinished
  }

  getEncryptedPrivateKey () {
    return this.encryptedPrivateKey
  }

  /**
   *
   * @param {string} generationHash
   * @param {int} networkType
   * @param {string} plainAddress
   */
  setNetworkProperties (generationHash, networkType, plainAddress) {
    this.generationHashMemory = generationHash
    this.networkTypeMemory = networkType
    this.address = plainAddress
  }

  getGenerationHash () {
    return this.generationHashMemory
  }

  getPublicKey () {
    return this.publicKey
  }

  getAddress () {
    return this.address
  }

  getNetworkType () {
    return this.networkTypeMemory
  }

  getEndPoint () {
    return this.endPoint
  }

  setSettings (endPoint) {
    this.localStorage.setItem(END_POINT, endPoint)
    this.endPoint = endPoint
  }

  setUp (encryptedPrivateKey, endPoint, password, publicKey) {
    this.localStorage.setItem(ENCRYPTED_PRIVATE_KEY, encryptedPrivateKey)
    this.encryptedPrivateKey = encryptedPrivateKey
    this.localStorage.setItem(END_POINT, endPoint)
    this.endPoint = endPoint

    this.passwordMemory = password
    this.localStorage.setItem(PUBLIC_KEY, publicKey)
    this.publicKey = publicKey
    localStorage.setItem(SETUP_FINISHED, 'TRUE')
    this.setUpFinished = true
  }

  /**
   * 署名時にパスワードを取得する
   * @return {string}
   */
  getPassword () {
    return this.passwordMemory
  }

  /**
   * 起動時にパスワードが入力されているかどうか
   * @return {boolean}
   */
  hasPassword () {
    return !!this.passwordMemory
  }

  /**
   * 起動時のパスワード入力
   * @param {string} password
   */
  setPassword (password) {
    this.passwordMemory = password
  }
}
