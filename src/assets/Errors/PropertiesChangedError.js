module.exports = class PropertiesChangedError extends Error {
  constructor () {
    super()
    this.name = 'PropertiesChangedError'
  }
}
