const { uint8ArrayToHex, hexToUint8Array, getSigningPayload } = require('./helper')
const tweetnacl = require('tweetnacl')

function privateKeyToPublicKey (hexPrivateKey) {
  const privateKey = hexToUint8Array(hexPrivateKey)
  const { publicKey } = tweetnacl.sign.keyPair.fromSeed(privateKey)
  return uint8ArrayToHex(publicKey)
}

function sign (hexPrivateKey, txPayload, generationHash) {
  const privateKey = hexToUint8Array(hexPrivateKey)
  const { publicKey } = tweetnacl.sign.keyPair.fromSeed(privateKey)
  const keyPair = { privateKey, publicKey }
  const txPayloadSigningBytes =
          hexToUint8Array(generationHash + getSigningPayload(txPayload))
  const secretKey = new Uint8Array(64)
  secretKey.set(keyPair.privateKey)
  secretKey.set(keyPair.publicKey, 32)
  const signature = tweetnacl.sign.detached(txPayloadSigningBytes, secretKey)
  return uint8ArrayToHex(signature)
}

function cosign (hexPrivateKey, hash) {
  const privateKey = hexToUint8Array(hexPrivateKey)
  const { publicKey } = tweetnacl.sign.keyPair.fromSeed(privateKey)
  const keyPair = { privateKey, publicKey }
  const txPayloadSigningBytes = hexToUint8Array(hash)
  const secretKey = new Uint8Array(64)
  secretKey.set(keyPair.privateKey)
  secretKey.set(keyPair.publicKey, 32)
  const signature = tweetnacl.sign.detached(txPayloadSigningBytes, secretKey)
  return uint8ArrayToHex(signature)
}

module.exports = {
  privateKeyToPublicKey,
  sign,
  cosign
}
