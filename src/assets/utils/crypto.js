const CryptoJS = require('crypto-js')

/**
 *
 * @param {string} data
 * @param {string} password
 * @return {string}
 */
function encrypt (data, password) {
  const encrypted = CryptoJS.AES.encrypt(data, password)
  return encrypted.toString()
}

/**
 *
 * @param data
 * @param password
 * @return {string}
 */
function decrypt (data, password) {
  const decrypted = CryptoJS.AES.decrypt(data, password)
  return decrypted.toString(CryptoJS.enc.Utf8)
}

module.exports = {
  encrypt,
  decrypt
}
