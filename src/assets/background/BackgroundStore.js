module.exports = class BackgroundStore {
  localStorage
  generationHash
  endPoint

  constructor (localStorage) {
    this.localStorage = localStorage
    this.generationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
    this.endPoint = 'https://dg0nbr5d1ohfy.cloudfront.net:443'
  }

  getPrivateKey () {
    return '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
  }

  getGenerationHash () {
    return this.generationHash
  }
}
