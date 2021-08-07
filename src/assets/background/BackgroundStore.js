const SETUP_FINISHED = 'SETUP_FINISHED'
const END_POINT = 'END_POINT'
const PUBLIC_KEY = 'PUBLIC_KEY'
const ENCRYPTED_PRIVATE_KEY = 'ENCRYPTED_PRIVATE_KEY'
const PASSWORD_HASH = 'PASSWORD_HASH'

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
  passwordHash

  constructor (localStorage) {
    this.localStorage = localStorage
    if (localStorage.getItem(SETUP_FINISHED) === null) {
      return
    }

    this.setUpFinished = true

    this.endPoint = localStorage.getItem(END_POINT)
    this.publicKey = localStorage.getItem(PUBLIC_KEY)
    this.encryptedPrivateKey = localStorage.getItem(ENCRYPTED_PRIVATE_KEY)
    this.passwordHash = localStorage.getItem(PASSWORD_HASH)
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

  setEndPoint (endPoint) {
    this.localStorage.setItem(END_POINT, endPoint)
    this.endPoint = endPoint
  }

  setUp (encryptedPrivateKey, endPoint, password, publicKey, passwordHash) {
    this.localStorage.setItem(ENCRYPTED_PRIVATE_KEY, encryptedPrivateKey)
    this.encryptedPrivateKey = encryptedPrivateKey
    this.localStorage.setItem(END_POINT, endPoint)
    this.endPoint = endPoint

    this.passwordMemory = password
    this.localStorage.setItem(PUBLIC_KEY, publicKey)
    this.publicKey = publicKey
    localStorage.setItem(SETUP_FINISHED, 'TRUE')
    this.setUpFinished = true
    localStorage.setItem(PASSWORD_HASH, passwordHash)
    this.passwordHash = passwordHash
  }

  factorySet () {
    this.localStorage.removeItem(ENCRYPTED_PRIVATE_KEY)
    this.encryptedPrivateKey = null
    this.localStorage.removeItem(END_POINT)
    this.endPoint = null

    this.passwordMemory = null
    this.localStorage.removeItem(PUBLIC_KEY)
    this.publicKey = null
    localStorage.removeItem(SETUP_FINISHED)
    this.setUpFinished = false
    localStorage.removeItem(PASSWORD_HASH)
    this.passwordHash = null

    this.generationHashMemory = null
    this.networkTypeMemory = null
    this.address = null
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

  /**
   * パスワードハッシュの比較
   * ログイン時にパスワードの正誤に使用
   * @param {string} passwordHash
   * @return {boolean}
   */
  equalsPasswordHash (passwordHash) {
    return this.passwordHash === passwordHash
  }
}
