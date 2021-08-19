const axios = require('axios')
const network = require('../../src/assets/utils/network')

jest.mock('axios')

describe('network', () => {

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
    const { generationHash, networkType, rawData } = await network.getProperties(endPoint)
    // expect(generationHash).toBe('3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155')
    // expect(networkType).toBe(152)
    expect(generationHash).toBe('networkGenerationHashSeed')
    expect(networkType).toBe(12345)
    expect(rawData).toHaveProperty('chain')
    expect(rawData).toHaveProperty('network')
    expect(rawData).toHaveProperty('plugins')
  })

  describe('checkNode', () => {
    test('successTestNet', async () => {
      axios.request.mockImplementation((config) => {
        return Promise.resolve({
          data: {
            "version": 16777472,
            "publicKey": "3BD4CECB2C82DE809CE6AD285ECF8687B4594EAE7D9220C2064E56812977EAE6",
            "networkGenerationHashSeed": "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155",
            "roles": 2,
            "port": 7900,
            "networkIdentifier": 152,
            "host": "ngl-api-001.testnet.symboldev.network",
            "friendlyName": "ngl-api-001",
            "nodePublicKey": "9B881DB30E7FDF0C21F0487EC24F5F6323B0C15001E1918D30BCCC6BA35701E7"
          }
        })
      })
      const endPoint = 'http://localhost:3000'
      const { success, data } = await network.checkNode(endPoint)
      expect(success).toBe(true)
      expect(data).toHaveProperty('isTestNet', true)
    })

    test('successMainNet', async () => {
      axios.request.mockImplementation((config) => {
        return Promise.resolve({
          data: {
            "version": 16777472,
            "publicKey": "",
            "networkGenerationHashSeed": "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6",
            "roles": 3,
            "port": 7900,
            "networkIdentifier": 104,
            "host": "",
            "friendlyName": "",
            "nodePublicKey": ""
          }
        })
      })
      const endPoint = 'http://localhost:3000'
      const { success, data } = await network.checkNode(endPoint)
      expect(success).toBe(true)
      expect(data).toHaveProperty('isTestNet', false)
    })

    test('fail', async () => {
      axios.request.mockImplementation((config) => {
        return Promise.reject(new Error('test'))
      })
      const endPoint = 'http://localhost:3000'
      const { success, data } = await network.checkNode(endPoint)
      expect(success).toBe(false)
      expect(data).toHaveProperty('error')
    })
  })
})
