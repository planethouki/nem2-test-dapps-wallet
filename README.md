# nem2-test-dapps-wallet

Browser Extension Wallet (Alpha version)

## Build Setup

``` bash
# install dependencies
$ yarn install

# build for production
$ yarn build
```

You can see the build results in the dist directory.
You can load this as an extension in each browser to see how it works.

## Getting Started

Building a web application (dApps) using this browser extension.

### Extension Detection

```javascript
if (typeof window.nem2 !== 'undefined') {
  console.log('extension is installed!')
}
```

### Accessing Accounts

```javascript
window.nem2.getAccountInfo().then((accountInfo) => {
    // something
})
```

## API Reference

### Methods

#### nem2.getAccountInfo

```javascript
nem2.getAccountInfo()
```

##### Parameters

none

##### Returns

`Promise<Object>`

- `networkType`: `Number`
- `generationHash`: `String`
- `publicKey`: `String`
- `addressPlain`: `String`
- `networkProperties`: `Object` - REST API Response of `/network/properties`

##### Example

```js
nem2.getAccountInfo().then((accountInfo) => {
    console.log(accountInfo)
})
/*
{
    "networkType": 152,
    "generationHash": "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155",
    "publicKey": "DFF2D798CF331CDDEC64FD9F8F565B3A78D3423700955B2EE03BDBD09F01E171",
    "addressPlain": "TAANPEY74KKND4QHPG5DZDPUY24NLPVLS6WIWWI",
    "networkProperties": {
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
            "harvestingMosaicId": "0x091F'837E'059A'E13C",
            "blockGenerationTargetTime": "30s",
            "blockTimeSmoothingFactor": "3000",
            "importanceGrouping": "180",
            "importanceActivityPercentage": "5",
            "maxRollbackBlocks": "0",
            "maxDifficultyBlocks": "60",
            "defaultDynamicFeeMultiplier": "100",
            "maxTransactionLifetime": "6h",
            "maxBlockFutureTime": "300ms",
            "initialCurrencyAtomicUnits": "7'842'928'625'000'000",
            "maxMosaicAtomicUnits": "8'999'999'999'000'000",
            "totalChainImportance": "7'842'928'625'000'000",
            "minHarvesterBalance": "10'000'000'000",
            "maxHarvesterBalance": "50'000'000'000'000",
            "minVoterBalance": "3'000'000'000'000",
            "votingSetGrouping": "720",
            "maxVotingKeysPerAccount": "3",
            "minVotingKeyLifetime": "28",
            "maxVotingKeyLifetime": "720",
            "harvestBeneficiaryPercentage": "25",
            "harvestNetworkPercentage": "5",
            "harvestNetworkFeeSinkAddress": "TCZ3UZPWWC5NR6TGGYEJ2MT4Z5ZLR3XTIVI4RHA",
            "maxTransactionsPerBlock": "6'000"
        },
        "plugins": {
          ...
        }
    }
}
 */
```

#### nem2.sign

```javascript
nem2.sign (payload, message = '')
```

##### Parameters

It expects AggregateTransaction(Bonded/Complete), but if you enter anything else, it will return the meaningless result of signing the transaction hash.

1. `String` - transaction payload
1. `String` - message for signing popup

##### Returns

`Promise<Object>`

- `payload`: `String`
- `hash`: `String`
- `signerPublicKey`: `String`
- `transactionType`: `Number`
- `networkType`: `Number`

#### nem2.cosign

```javascript
nem2.cosign (payload, message = '')
```

##### Parameters

1. `String` - unsigned transaction payload (Even if it's signed, ignore it, so I expect it to be signed with a one-time account)
1. `String` - message for signing popup

##### Returns

`Promise<Object>`

1. `signature`: `String`
1. `signer`: `Object`
    1. `publicKey`: `String`
    1. `address`: `Object`
        1. `address`: `String`
        1. `networkType`: `Nubmer`
1. `version`: `Object`
    1. `lower`: `Number` - always 0
    1. `higher`: `Number` - always 0
