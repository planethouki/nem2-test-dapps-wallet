const base32 = require('../../src/assets/utils/base32')

describe('base32', () => {
  test('getBase32DecodeAddress', () => {
    const { getBase32DecodeAddress } = base32
    const addressPlain = 'TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA'
    const addressPretty = 'TC7ULQ-WT6A3Z-6GTCMJ-UQSCD5-G6YZNO-VPVZ7U-YPA'
    const rawAddress = '98BF45C2D3F0379F1A62626909087D37B196BAAFAE7F4C3C'
    expect(getBase32DecodeAddress(addressPlain)).toBe(rawAddress)
    expect(getBase32DecodeAddress(addressPretty)).toBe(rawAddress)
  })

  test('getBase32EncodeAddress', () => {
    const { getBase32EncodeAddress } = base32
    const addressPlain = 'TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA'
    const rawAddress = '98BF45C2D3F0379F1A62626909087D37B196BAAFAE7F4C3C'
    expect(getBase32EncodeAddress(rawAddress)).toBe(addressPlain)
  })
})
