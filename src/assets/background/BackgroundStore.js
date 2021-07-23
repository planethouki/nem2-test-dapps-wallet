module.exports = class BackgroundStore {
  localStorage
  generationHash
  networkType
  endPoint
  publicKey

  constructor (localStorage) {
    this.localStorage = localStorage
    this.endPoint = 'https://dg0nbr5d1ohfy.cloudfront.net:443'
    this.publicKey = 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580'
  }

  getPrivateKey () {
    return '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
  }

  /**
   *
   * @param {string} generationHash
   * @param {int} networkType
   */
  setNetworkProperties (generationHash, networkType) {
    this.generationHash = generationHash
    this.networkType = networkType
  }

  getGenerationHash () {
    return this.generationHash
  }

  getPublicKey () {
    return this.publicKey
  }

  getEndPoint () {
    return this.endPoint
  }
}
