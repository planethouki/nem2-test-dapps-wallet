const nem2 = require('../../src/assets/utils/nem2')
const helper = require('../../src/assets/utils/helper')

describe('nem2', () => {
  test('sign', () => {
    const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
    const generationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
    const signedTransaction =  {
      payload: 'BB0000000000000041357A89184452E4AF71B47DA654D84B6B2BD486D2D0E656EE59F97FD4191EC117ACC5ABED543DCF6B8D359FAB6BCBD70BB8517B6EB487F75DD00ADDDD6EDD0DC65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A',
      hash: 'F70A1641B74CEB777A3165BA5751806FFDDC3E2F634220DE566EF39C85E26AEC',
      signerPublicKey: 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580',
      type: 16724,
      networkType: 152
    }

    const expectSignature = signedTransaction.payload.substr((8) * 2, (64) * 2)

    const unsignedPayload = helper.spliceSignature(
      signedTransaction.payload,
      "".padStart(128, "0"),
      "".padStart(64, "0")
    )

    expect(nem2.sign(privateKey, unsignedPayload, generationHash)).toBe(expectSignature)
  })

  test('privateKeyToPublicKey', () => {
    const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
    const publicKey = 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580'
    expect(nem2.privateKeyToPublicKey(privateKey)).toBe(publicKey)
  })

  test('getProperties',  async () => {
    const endPoint = 'https://dg0nbr5d1ohfy.cloudfront.net:443'
    const { generationHash, networkType } = await nem2.getProperties(endPoint)
    expect(generationHash).toBe('3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155')
    expect(networkType).toBe(152)
  })
})