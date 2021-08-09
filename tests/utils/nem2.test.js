const axios = require('axios')
const nem2 = require('../../src/assets/utils/nem2')
const helper = require('../../src/assets/utils/helper')

jest.mock('axios')

describe('nem2', () => {

  describe('sign', () => {
    test('transferTransaction', () => {
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

    test('aggregateBondedTransaction', () => {
      const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
      const generationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
      const signedTransaction = {
        payload: '18010000000000003C368796C3B8C8F619F6E60B8E600BE69CA6A7F4CE0F555EC47789AB2FEDCA60A547A8882EB853A6CF0DA44A040775E929944F3709F183FC7ED5021ACEF2F50CC65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001984142400D0300000000002C11C6BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000',
        hash: '2CC57BF4235322C01369FF227BB2E5307C38EC23229186331DFA16E5B785CDDE',
        signerPublicKey: 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580',
        type: 16961,
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

    test('aggregateCompleteTransaction', () => {
      const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
      const generationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
      const signedTransaction = {
        payload: '18010000000000006FA8A4F96E16739546F99351721D0E44938E3D6A26BBF69E12A6C1D63EAA4E6DBEDC15F02BED62107C27012B58FAA69C91412A9AE8F72136D62CAD7DDA940809C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001984141400D030000000000C10CC0BB020000008A41A038B7AE52490E97FD2FB5E95AB154A98D5AB60A56263A3C1A624731DC2D70000000000000006B00000000000000C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC3858000000000019854419814F3DABC922F7B2D06A6AF544B58E5CFA2099C91B0077C0B000100000000003CE19A057E831F0900E40B540200000000386D544575416932746A0000000000',
        hash: '7AD7C2B2F7B2CA3CB347DDAEF114E3DDCE330CFB35C0E57B5DFEF0E9D770CE87',
        signerPublicKey: 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580',
        type: 16705,
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
  })

  test('privateKeyToPublicKey', () => {
    const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
    const publicKey = 'C65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC38580'
    expect(nem2.privateKeyToPublicKey(privateKey)).toBe(publicKey)
  })

  test('getProperties',  async () => {
    axios.request.mockImplementation((config) => {
      if (config.url === '/node/info') {
        return {
          data: {
            networkGenerationHashSeed: 'networkGenerationHashSeed',
            networkIdentifier: 12345
          }
        }
      }

      return {
        data: {"network":{"identifier":"public-test","nemesisSignerPublicKey":"2267B24107405779DDF0D8FBEABD8142B97105F356F3737B1FC02220E8F90FF2","nodeEqualityStrategy":"host","generationHashSeed":"3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155","epochAdjustment":"1616694977s"},"chain":{"enableVerifiableState":true,"enableVerifiableReceipts":true,"currencyMosaicId":"0x091F'837E'059A'E13C","harvestingMosaicId":"0x091F'837E'059A'E13C","blockGenerationTargetTime":"30s","blockTimeSmoothingFactor":"3000","importanceGrouping":"180","importanceActivityPercentage":"5","maxRollbackBlocks":"0","maxDifficultyBlocks":"60","defaultDynamicFeeMultiplier":"100","maxTransactionLifetime":"6h","maxBlockFutureTime":"300ms","initialCurrencyAtomicUnits":"7'842'928'625'000'000","maxMosaicAtomicUnits":"8'999'999'999'000'000","totalChainImportance":"7'842'928'625'000'000","minHarvesterBalance":"10'000'000'000","maxHarvesterBalance":"50'000'000'000'000","minVoterBalance":"3'000'000'000'000","votingSetGrouping":"720","maxVotingKeysPerAccount":"3","minVotingKeyLifetime":"28","maxVotingKeyLifetime":"720","harvestBeneficiaryPercentage":"25","harvestNetworkPercentage":"5","harvestNetworkFeeSinkAddress":"TCZ3UZPWWC5NR6TGGYEJ2MT4Z5ZLR3XTIVI4RHA","maxTransactionsPerBlock":"6'000"},"plugins":{"accountlink":{"dummy":"to trigger plugin load"},"aggregate":{"maxTransactionsPerAggregate":"100","maxCosignaturesPerAggregate":"25","enableStrictCosignatureCheck":false,"enableBondedAggregateSupport":true,"maxBondedTransactionLifetime":"48h"},"lockhash":{"lockedFundsPerAggregate":"10'000'000","maxHashLockDuration":"2d"},"locksecret":{"maxSecretLockDuration":"365d","minProofSize":"0","maxProofSize":"1024"},"metadata":{"maxValueSize":"1024"},"mosaic":{"maxMosaicsPerAccount":"1'000","maxMosaicDuration":"3650d","maxMosaicDivisibility":"6","mosaicRentalFeeSinkAddress":"TAFNXW3VXVFTGTVGATKQAR75ALQX7DQXQJRWWTA","mosaicRentalFee":"500000"},"multisig":{"maxMultisigDepth":"3","maxCosignatoriesPerAccount":"25","maxCosignedAccountsPerAccount":"25"},"namespace":{"maxNameSize":"64","maxChildNamespaces":"100","maxNamespaceDepth":"3","minNamespaceDuration":"30d","maxNamespaceDuration":"1825d","namespaceGracePeriodDuration":"1d","reservedRootNamespaceNames":"symbol, symbl, xym, xem, nem, user, account, org, com, biz, net, edu, mil, gov, info","namespaceRentalFeeSinkAddress":"TATBDUEWS2X2BKKBPVB7SY4Z626YCAERGA3IF5A","rootNamespaceRentalFeePerBlock":"2","childNamespaceRentalFee":"100000"},"restrictionaccount":{"maxAccountRestrictionValues":"100"},"restrictionmosaic":{"maxMosaicRestrictionValues":"20"},"transfer":{"maxMessageSize":"1024"}}}
      }
    })
    const endPoint = 'http://localhost:3000'
    const { generationHash, networkType, rawData } = await nem2.getProperties(endPoint)
    // expect(generationHash).toBe('3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155')
    // expect(networkType).toBe(152)
    expect(generationHash).toBe('networkGenerationHashSeed')
    expect(networkType).toBe(12345)
    expect(rawData).toHaveProperty('chain')
    expect(rawData).toHaveProperty('network')
    expect(rawData).toHaveProperty('plugins')
  })
})
