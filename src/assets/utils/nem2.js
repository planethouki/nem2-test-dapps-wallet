const { uint8ArrayToHex, hexToUint8Array, getSigningPayload } = require('./helper')
const tweetnacl = require('tweetnacl')
const axios = require('axios')

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

async function getProperties(endPoint) {
  return axios.request({
    method: "GET",
    baseURL: endPoint,
    url: '/node/info'
  }).then((res) => {
    const {
      networkGenerationHashSeed,
      networkIdentifier
    } = res.data
    return {
      generationHash: networkGenerationHashSeed,
      networkType: networkIdentifier
    }
  })
}

module.exports = {
  privateKeyToPublicKey,
  sign,
  getProperties
}
