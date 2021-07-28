export default class BackgroundStore {
  localStorage
  generationHashMemory
  networkTypeMemory
  endPoint
  publicKey
  address
  password
  encryptedPrivateKey

  constructor (localStorage) {
    this.localStorage = localStorage
    this.endPoint = 'https://dg0nbr5d1ohfy.cloudfront.net:443'
    this.publicKey = 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580'
    this.address = 'TCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA'
    this.password = 'password'
    this.encryptedPrivateKey = 'U2FsdGVkX1+lJACmqEDPQHqgjt3XA2Q/vhooS8hNWpzbHXmm2ZNOBnqvYacN4YEyCuaw1pWx/no/vPR/A9lIw0BIF7v4NJnWXoOszb2bH8ejAv2MEZd7hcF3s1XVxVtb'
  }

  getPrivateKey () {
    return '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
  }

  getEncryptedPrivateKey () {
    return this.encryptedPrivateKey
  }

  setEncryptedPrivateKey (encryptedPrivateKey) {
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
    this.endPoint = endPoint
  }

  getEndPoint () {
    return this.endPoint
  }

  getPassword () {
    return this.password
  }
}
