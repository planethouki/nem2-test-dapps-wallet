const SETUP_FINISHED = 'SETUP_FINISHED'
const END_POINT = 'END_POINT'
const PUBLIC_KEY = 'PUBLIC_KEY'
const ADDRESS = 'ADDRESS'
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

    this.endPoint = localStorage.getItem(END_POINT) ?? 'https://dg0nbr5d1ohfy.cloudfront.net:443'
    this.publicKey = localStorage.getItem(PUBLIC_KEY) ?? 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580'
    this.address = localStorage.getItem(ADDRESS) ?? 'TCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA'
    this.encryptedPrivateKey = localStorage.getItem(ENCRYPTED_PRIVATE_KEY) ?? 'U2FsdGVkX1+lJACmqEDPQHqgjt3XA2Q/vhooS8hNWpzbHXmm2ZNOBnqvYacN4YEyCuaw1pWx/no/vPR/A9lIw0BIF7v4NJnWXoOszb2bH8ejAv2MEZd7hcF3s1XVxVtb'
  }

  isSetUpFinished () {
    return this.setUpFinished
  }

  getEncryptedPrivateKey () {
    return this.encryptedPrivateKey
  }

  setEncryptedPrivateKey (encryptedPrivateKey) {
    this.localStorage.setItem(ENCRYPTED_PRIVATE_KEY, encryptedPrivateKey)
    this.encryptedPrivateKey = encryptedPrivateKey
  }

  /**
   *
   * @param {string} generationHash
   * @param {int} networkType
   */
  setNetworkProperties (generationHash, networkType) {
    this.generationHashMemory = generationHash
    this.networkTypeMemory = networkType
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

  setEndPoint (endPoint) {
    this.localStorage.setItem(END_POINT, endPoint)
    this.endPoint = endPoint
  }

  getEndPoint () {
    return this.endPoint
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

  getPassword () {
    return this.passwordMemory
  }
}
