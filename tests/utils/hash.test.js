const hash = require('../../src/assets/utils/hash')

describe('hash', () => {
  test('getTransactionHash', () => {
    const { getTransactionHash } = hash
    const g = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD'
    const p = 'B000000000000000123AF01746042B9F01F1E429EFC3B3CE4EA82C02E54E548B04C721A3BB1EB8A3619980F361B9AEA9942BC11504E2D5E801C7884AFBFE5136E6E3D6DF212AE40E1B9BBCAB6DDAB54C3534F3C47B0E42518435CB767F55743C97D09A12A1EC0B490000000001985441204E0000000000000529DE0208000000988063F3D1382D8715866432067E251B0106ADD4868428BC0000010000000000EEAFF441BA994BE7EBB39274FB000000'
    const h = 'DD7C0A664F804E5651C557A57B16E7A189F727E18AD282B578710991A1102B6C'
    expect(getTransactionHash(p, g)).toBe(h)
  })

  test('publicKeyToHexAddress', () => {
    const publicKey = '713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255'
    const addressPlain = 'TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA'
    const addressPretty = 'TC7ULQ-WT6A3Z-6GTCMJ-UQSCD5-G6YZNO-VPVZ7U-YPA'
    const rawAddress = '98BF45C2D3F0379F1A62626909087D37B196BAAFAE7F4C3C'
    const { publicKeyToHexAddress } = hash
    expect(publicKeyToHexAddress(publicKey)).toBe(rawAddress)
  })

  test('publicKeyToHexAddressPrefix', () => {
    const publicKey = '713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255'
    const rawAddressTest = '98BF45C2D3F0379F1A62626909087D37B196BAAFAE7F4C3C'
    const rawAddressMain = '68BF45C2D3F0379F1A62626909087D37B196BAAFAE96D6AB'
    const { publicKeyToHexAddress } = hash
    expect(publicKeyToHexAddress(publicKey, 152)).toBe(rawAddressTest)
    expect(publicKeyToHexAddress(publicKey, 104)).toBe(rawAddressMain)
  })

  test('hashPassword', () => {
    const h = hash.hashPassword('hoge')
    expect(h.length).toBe(64)
    expect(h).toMatch(/[A-F\d]+/)
  })
})
