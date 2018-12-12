# Quorum.js: JavaScript integration library for Quorum

Quorum.js is an extension to [web3.js](https://github.com/ethereum/web3.js/) providing support for
[JP Morgan's Quorum](https://github.com/jpmorganchase/quorum) API.

Web3.js is the Ethereum compatible `JavaScript API` which implements the Generic JSON RPC spec.

For further information on web3.js, please refer to the [main project page](https://github.com/ethereum/web3.js/)
and the documentation at [Read the Docs](https://web3js.readthedocs.io/en/1.0).

## Features

-   Support for Quorum's private transactions through `constellation`
-   [QuorumChain API](https://github.com/jpmorganchase/quorum/blob/master/docs/api.md#quorumchain-apis) implementation
-   Works out the box with web3.js' 
    [smart contract wrappers](http://docs.web3j.io/smart_contracts.html#solidity-smart-contract-wrappers)

## Installation via NPM

`Quorum-js` is available via `npm` package manager. To install it locally use the following command:
`npm install quorum-js`

## Run Quorum

See instructions as per the [Quorum project page](https://github.com/jpmorganchase/quorum)

## Start sending requests

## Starting Web3 on HTTP

To send asynchronous requests we need to instantiate `web3` with a `HTTP` address that points to the `Quorum`node.

```js
      const Web3 = require("web3");
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:22001")
      );
      const account = web3.eth.accounts[0];
```

## Enclaves

The library supports connections to private enclaves:

```js

const web3 = new Web3(new Web3.providers.HttpProvider(address));
const quorumjs = require("quorum-js");

const tessera = quorumjs.enclaves.Tessera(web3, "http://localhost:8080", "http://localhost:8090");
const constellation = quorumjs.enclaves.Constellation(web3, "<your ipc path>");

const rawTransactionManager = RawTransactionManager(web3, tessera/constellation);

rawTransactionManager.sendRawTransaction({
        gasPrice: 0,
        gasLimit: 4300000,
        to: "",
        value: 0,
        data: deploy,
        from: decryptedAccount,
        isPrivate: true,
        privateFrom: TM1_PUBLIC_KEY,
        privateFor: TM2_PUBLIC_KEY,
        nonce
      });
```

It sends a private transaction to the network [ this transaction can be either a contract deployment or a contract call ].


##### Parameters

1. `Object` - The transaction object to send:
    - <strike>`gasPrice`: `Number` - The price of gas for this transaction, defaults to the mean 
    network gas price [ because we work in a private network the gasPrice is 0 ].</strike>
    - `gasLimit`: `Number` - The amount of gas to use for the transaction.
    - `to`: `String` - (optional) The destination address of the message, left undefined for a contract-creation 
    transaction [in case of a contract creation the to field must be `null`].
    - `value`: `Number` - (optional) The value transferred for the transaction, also the 
    endowment if it's a contract-creation transaction.
    - `data`: `String` - (optional) Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) 
    containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code (bytecode).
    - `decryptedAccount` : `String` - the public key of the sender's account;
    - `nonce`: `Number`  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
    - `privateFrom`: `String`  - (optional) When sending a private transaction, the sending party's base64-encoded public key to use. If not present *and* passing `privateFor`, use the default key as configured in the `TransactionManager`.
    - `privateFor`: `List<String>`  - (optional) When sending a private transaction, an array of the recipients' base64-encoded public keys.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous.

##### Returns

`String` - The 32 Bytes transaction hash as HEX string.

