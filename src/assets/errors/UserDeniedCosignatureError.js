module.exports = class UserDeniedCosignatureError extends Error {
  constructor () {
    super()
    this.name = 'UserDeniedCosignatureError'
  }
}
