function endian (hex) {
  const result = []
  let len = hex.length - 2
  while (len >= 0) {
    result.push(hex.substr(len, 2))
    len -= 2
  }
  return result.join('')
}

function uint8ArrayToHex (arrayBuffer) {
  return [...new Uint8Array(arrayBuffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

function hexToUint8Array (hex) {
  return new Uint8Array(hex.toLowerCase().match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))
}

function getSigningPayload (payload) {
  return payload.substr((8 + 64 + 32 + 4) * 2)
}

function getSizePayload (payload) {
  return payload.substring(0, (4) * 2)
}

function spliceSignature (unsignedPayload, signature, signerPublicKey) {
  return getSizePayload(unsignedPayload) +
    ''.padStart(8, '0') +
    signature +
    signerPublicKey +
    ''.padStart(8, '0') +
    getSigningPayload(unsignedPayload)
}

function getTransactionType (payload) {
  const hex = payload.substr((4 + 4 + 64 + 32 + 4 + 2) * 2, (2) * 2)
  return Number(`0x${endian(hex)}`)
}

module.exports = {
  endian,
  uint8ArrayToHex,
  hexToUint8Array,
  getSigningPayload,
  spliceSignature,
  getSizePayload,
  getTransactionType
}
