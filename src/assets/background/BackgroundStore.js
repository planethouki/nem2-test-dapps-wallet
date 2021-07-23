module.exports = class BackgroundStore {
  localStorage

  constructor (localStorage) {
    this.localStorage = localStorage
  }

  getPrivateKey () {
    return '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
  }
}
