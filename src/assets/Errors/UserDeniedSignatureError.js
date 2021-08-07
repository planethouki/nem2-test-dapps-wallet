module.exports = class UserDeniedSignatureError extends Error {
  constructor () {
    super()
    this.name = 'UserDeniedSignatureError'
  }
}
