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


  describe('getSigningPayload', () => {
    test('transferTransaction', () => {
      const toBe = '01985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A'
      expect(helper.getSigningPayload(payload)).toBe(toBe)
    })
    test('aggregateBondedTransaction', () => {
      const p = "1801000000000000FF6AA114A8A6FD6E15F92CB67C4D674ABC7A17D659310B59A6D7AA3D8C84BCE7EA1D410E27346B62215C771F8506BC87A74EE0698C419FAB1E5042DE44961504DFF2D798CF331CDDEC64FD9F8F565B3A78D3423700955B2EE03BDBD09F01E1710000000001984142400D030000000000B9F219BA020000009C28AF8CA66117FBAAB83387CD63FD2F78AF447C28BD097060C8A6A2565F3D1670000000000000006B00000000000000DFF2D798CF331CDDEC64FD9F8F565B3A78D3423700955B2EE03BDBD09F01E17100000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000"
      const toBeWithGenerationHash = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC115501984142400D030000000000B9F219BA020000009C28AF8CA66117FBAAB83387CD63FD2F78AF447C28BD097060C8A6A2565F3D16"
      const toBe = toBeWithGenerationHash.substr(64)
      expect(helper.getSigningPayload(p)).toBe(toBe)
    })
    test('aggregateCompleteTransaction', () => {
      const p = "1801000000000000D78955A603814A643DB8047E81D2D76A7625126E9F112C6907EDCA54C53926A064554C638C8CAB80F247CF9071B4263EEA79F6D7BF83454328B1D15BE7DC3D0BDFF2D798CF331CDDEC64FD9F8F565B3A78D3423700955B2EE03BDBD09F01E1710000000001984141400D0300000000005F2232BA020000009C28AF8CA66117FBAAB83387CD63FD2F78AF447C28BD097060C8A6A2565F3D1670000000000000006B00000000000000DFF2D798CF331CDDEC64FD9F8F565B3A78D3423700955B2EE03BDBD09F01E17100000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000"
      const toBeWithGenerationHash = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC115501984141400D0300000000005F2232BA020000009C28AF8CA66117FBAAB83387CD63FD2F78AF447C28BD097060C8A6A2565F3D16"
      const toBe = toBeWithGenerationHash.substr(64)
      expect(helper.getSigningPayload(p)).toBe(toBe)
    })
  })

  test('getSizePayload', () => {
    expect(helper.getSizePayload(payload)).toBe('BB000000')
  })

  describe('spliceSignature', () => {
    test('transferTransaction', () => {
      const toBe = 'BB00000000000000ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0000000001985441A0860100000000006E8CFA66020000009814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A'
      expect(helper.spliceSignature(payload, ''.padStart(128, 'Z'), ''.padStart(64, 'X'))).toBe(toBe)
    })
    test('aggregateBondedTransaction', () => {
      const toBe = '1801000000000000ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0000000001984142400D0300000000002C11C6BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000'
      const signedTransaction = {
        payload: '18010000000000003C368796C3B8C8F619F6E60B8E600BE69CA6A7F4CE0F555EC47789AB2FEDCA60A547A8882EB853A6CF0DA44A040775E929944F3709F183FC7ED5021ACEF2F50CC65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001984142400D0300000000002C11C6BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000',
        hash: '2CC57BF4235322C01369FF227BB2E5307C38EC23229186331DFA16E5B785CDDE',
        signerPublicKey: 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580',
        type: 16961,
        networkType: 152
      }
      expect(helper.spliceSignature(signedTransaction.payload, ''.padStart(128, 'Z'), ''.padStart(64, 'X'))).toBe(toBe)
    })
    test('aggregateCompleteTransaction', () => {
      const toBe = '1801000000000000ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0000000001984141400D030000000000C10CC0BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000'
      const signedTransaction = {
        payload: '18010000000000006FA8A4F96E16739546F99351721D0E44938E3D6A26BBF69E12A6C1D63EAA4E6DBEDC15F02BED62107C27012B58FAA69C91412A9AE8F72136D62CAD7DDA940809C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001984141400D030000000000C10CC0BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000',
        hash: '7AD7C2B2F7B2CA3CB347DDAEF114E3DDCE330CFB35C0E57B5DFEF0E9D770CE87',
        signerPublicKey: 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580',
        type: 16705,
        networkType: 152
      }
      expect(helper.spliceSignature(signedTransaction.payload, ''.padStart(128, 'Z'), ''.padStart(64, 'X'))).toBe(toBe)
    })
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

  test('parseNetworkProperties', () => {
    const raw = {
      "network": {
        "identifier": "public-test",
        "nemesisSignerPublicKey": "2267B24107405779DDF0D8FBEABD8142B97105F356F3737B1FC02220E8F90FF2",
        "nodeEqualityStrategy": "host",
        "generationHashSeed": "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155",
        "epochAdjustment": "1616694977s"
      },
      "chain": {
        "enableVerifiableState": true,
        "enableVerifiableReceipts": true,
        "currencyMosaicId": "0x091F'837E'059A'E13C",
        "harvestingMosaicId": "0x191F'837E'059A'E13C"
      },
      "plugins": {}
    }
    const result = helper.parseRestNetworkProperties(raw)
    expect(result.epochAdjustment).toBe(1616694977)
    expect(result.currencyMosaicId).toBe("091F837E059AE13C")
    expect(result.harvestingMosaicId).toBe("191F837E059AE13C")
  })
})
