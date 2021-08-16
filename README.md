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
