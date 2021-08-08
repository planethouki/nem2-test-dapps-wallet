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
  const transactionType = getTransactionType(payload)
  if (transactionType === 16705 || transactionType === 16961) {
    return payload.substr((8 + 64 + 32 + 4) * 2, (2 + 2 + 8 + 8 + 32) * 2)
  } else {
    return payload.substr((8 + 64 + 32 + 4) * 2)
  }
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

function getNetworkTypeString (networkType) {
  switch (networkType) {
    case 0x68:
      return 'MAIN_NET'
    case 0x98:
      return 'TEST_NET'
    case 0x60:
      return 'MIJIN'
    case 0x90:
      return 'MIJIN_TEST'
    case 0x78:
      return 'PRIVATE'
    case 0xa8:
      return 'PRIVATE_TEST'
  }
}

module.exports = {
  endian,
  uint8ArrayToHex,
  hexToUint8Array,
  getSigningPayload,
  spliceSignature,
  getSizePayload,
  getTransactionType,
  getNetworkTypeString
}
