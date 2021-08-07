const { hexToUint8Array, uint8ArrayToHex } = require('./helper')
const { sha3_256: sha3 } = require('js-sha3')
const Ripemd160 = require('ripemd160')

/**
 *
 * @param {string} signedTxPayload
 * @param {string} generationHash
 * @return {string}
 */
function getTransactionHash (signedTxPayload, generationHash) {
  const hashInputPayload =
        signedTxPayload.substr(8 * 2, 64 * 2) +
        signedTxPayload.substr((8 + 64) * 2, 32 * 2) +
        generationHash +
        signedTxPayload.substr((8 + 64 + 32 + 4) * 2)
  const hashByte = sha3.digest(hexToUint8Array(hashInputPayload))
  const hashed = uint8ArrayToHex(hashByte)
  return hashed.toUpperCase()
}

/**
 *
 * @param {string} publicKey
 * @param {number} prefix
 * @return {string}
 */
function publicKeyToHexAddress (publicKey, prefix = 152) {
  const sha3ed = sha3.digest(hexToUint8Array(publicKey))
  const a = new Ripemd160().update(Buffer.from(sha3ed)).digest('hex')
  const b = `00${prefix.toString(16)}`.substr(-2) + a
  const check = uint8ArrayToHex(sha3.digest(hexToUint8Array(b)))
  const c = b + check.substr(0, 6)
  return c.toUpperCase()
}

/**
 *
 * @param {string} password
 * @return {string}
 */
function hashPassword (password) {
  return sha3(password).toUpperCase()
}

module.exports = {
  getTransactionHash,
  publicKeyToHexAddress,
  hashPassword
}
