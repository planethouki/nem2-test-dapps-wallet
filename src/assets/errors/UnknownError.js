module.exports = class UnknownError extends Error {
  constructor () {
    super()
    this.name = 'UnknownError'
  }
}
