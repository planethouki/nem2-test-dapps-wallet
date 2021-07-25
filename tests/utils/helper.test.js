const helper = require('../../src/assets/utils/helper')

describe('helper', () => {

  const payload = 'BB0000000000000041357A89184452E4AF71B47DA654D84B6B2BD486D2D0E656EE59F97FD4191EC117ACC5ABED543DCF6B8D359FAB6BCBD70BB8517B6EB487F75DD00ADDDD6EDD0DC65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A'

  describe('endian', () => {
    test('gt1byte', () => {
      expect(helper.endian('123456')).toBe('563412')
    })
    test('1byte', () => {
      expect(helper.endian('78')).toBe('78')
    })
  })

  test('getSigningPayload', () => {
    const toBe = '01985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A'
    expect(helper.getSigningPayload(payload)).toBe(toBe)
  })

  test('getSizePayload', () => {
    expect(helper.getSizePayload(payload)).toBe('BB000000')
  })

  test('spliceSignature', () => {
    const toBe = 'BB00000000000000ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0000000001985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A'
    expect(helper.spliceSignature(payload, ''.padStart(128, 'Z'), ''.padStart(64, 'X'))).toBe(toBe)
  })

  test('getTransactionType', () => {
    expect(helper.getTransactionType(payload)).toBe(16724)
  })

  test('getNetworkTypeString', () => {
    expect(helper.getNetworkTypeString(104)).toBe('MAIN_NET')
    expect(helper.getNetworkTypeString(152)).toBe('TEST_NET')
    expect(helper.getNetworkTypeString(96)).toBe('MIJIN')
    expect(helper.getNetworkTypeString(144)).toBe('MIJIN_TEST')
    expect(helper.getNetworkTypeString(120)).toBe('PRIVATE')
    expect(helper.getNetworkTypeString(168)).toBe('PRIVATE_TEST')
  })

})
