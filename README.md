# Quorum.js: JavaScript integration library for Quorum

Quorum.js is an extension to [web3.js](https://github.com/ethereum/web3.js/) providing support for
[JP Morgan's Quorum](https://github.com/jpmorganchase/quorum) API.

Web3.js is the Ethereum compatible `JavaScript API` which implements the Generic JSON RPC spec.

For further information on web3.js, please refer to the [main project page](https://github.com/ethereum/web3.js/)
and the documentation at [Read the Docs](https://web3js.readthedocs.io/en/1.0).

## Features

-   Support for Quorum's private transactions through private transaction manager
-   Ability to send **signed** private transactions
-   Works out the box with web3.js' 
    [smart contract wrappers](http://docs.web3j.io/smart_contracts.html#solidity-smart-contract-wrappers)
-   Provides web3 extension for all Quorum specific APIs

## Installation via NPM

`Quorum-js` is available via `npm` package manager. To install it locally use the following command:
`npm install quorum-js`

## Run Quorum

See instructions as per the [Quorum project page](https://github.com/jpmorganchase/quorum)

## Start sending requests

## Starting Web3 on HTTP

To send asynchronous requests we need to instantiate `web3` with a `HTTP` address that points to the `Quorum` node.

```js
      const Web3 = require("web3");
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:22001")
      );
      const account = web3.eth.accounts[0];
```

## Enclaves

The library supports connection to Quorum private transaction manager and execution of a raw transaction. Example **pseudo** code:

```js

const web3 = new Web3(new Web3.providers.HttpProvider(address));
const quorumjs = require("quorum-js");

const enclaveOptions = {
  /* at least one enclave option must be provided */
  /* ipcPath is preferred for utilizing older API */
  ipcPath: "/quorum-examples/examples/7nodes/qdata/c1/tm.ipc",
  publicUrl: "http://localhost:8080",
  privateUrl: "http://localhost:8090"
};

const rawTransactionManager = quorumjs.RawTransactionManager(web3, enclaveOptions);

const txnParams = {
  gasPrice: 0,
  gasLimit: 4300000,
  to: "",
  value: 0,
  data: deploy,
  from: decryptedAccount,
  isPrivate: true,
  privateFrom: TM1_PUBLIC_KEY,
  privateFor: [TM2_PUBLIC_KEY],
  nonce
};

// Older API: txn manager and Quorum version agnostic
// requires the IPC path to be set in enclaveOptions
rawTransactionManager.sendRawTransactionViaSendAPI(txnParams);

// Newer API: Quorum v2.2.1+ and Tessera
// requires the private URL to be set in enclaveOptions
rawTransactionManager.sendRawTransaction(txnParams);
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
    - `privateFrom`: `String`  - When sending a private transaction, the sending party's base64-encoded public key to use. If not present *and* passing `privateFor`, use the default key as configured in the `TransactionManager`.
    - `privateFor`: `List<String>`  - When sending a private transaction, an array of the recipients' base64-encoded public keys.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous.

##### Returns

`String` - The 32 Bytes transaction hash as HEX string.


### Send raw transactions using external signer. [Only available in Tessera with Quorum v2.2.0+]

If you want to use a different transaction signing mechanism, here are the steps to invoke the relevant APIs separately.

Firstly, a `storeRawRequest` function would need to be called by the enclave:

```js

const web3 = new Web3(new Web3.providers.HttpProvider(address));
const quorumjs = require("quorum-js");

const txnManager = quorumjs.RawTransactionManager(web3, {
  publicUrl: "http://localhost:8080",
  privateUrl: "http://localhost:8090"
});

txnManager.storeRawRequest(data, from)

```

##### Parameters

  - `data`: `String` - Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) 
    containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code (bytecode).
  - `from`: `String` (Optional) - Sender public key

A raw transaction will then need to be formed and signed, please note the data field will need to be replaced with the transaction hash which was returned from the privacy manager (the `key` field of the response data from `storeRawRequest` api call).


Secondly, the raw transaction can then be sent to Quorum by `sendRawRequest` function:

```js

var privateFor = ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]

txnManager.sendRawRequest(serializedTransaction, privateFor)

```

##### Parameters

  - `serializedTransaction`: `String` - Signed transaction data in HEX format.
  - `privateFor`: `List<String>` - When sending a private transaction, an array of the recipients' base64-encoded public keys.


## Extending web3 instance with Quorum APIs
Quorum.js offers a way to add Quorum specific APIs to an intance of web3. Current APIs that may be extended are [Raft](https://github.com/jpmorganchase/quorum/blob/master/docs/raft.md), [Istanbul](https://github.com/jpmorganchase/quorum/blob/master/docs/istanbul-rpc-api.md), and [Privacy](https://github.com/jpmorganchase/quorum/blob/master/docs/api.md) APIs. Extending your web3 instance is as simple as calling `quorumjs.extend` with the list of APIs you need. Please note that web3 will receive a quorum specific namespace after extension `web3.quorum`

```js

const web3 = new Web3(new Web3.providers.HttpProvider(address));
const quorumjs = require("quorum-js");

quorumjs.extend(web3)

```

##### Parameters

  - `web3`: `Object` - web3 instance
  - `apis`: `String` (Optional) - List of comma separated Quorum APIs to extend web3 instance with. APIs available are raft, istanbul, and eth - default is to add all APIs. Example: `quorumjs.extend(web3, 'raft,eth')`



## Examples for using Quorum.js with [quorum-examples/7nodes](https://github.com/jpmorganchase/quorum-examples/tree/master/examples/7nodes)

Please see using Constellation and Quorum implementation private txn [example](https://github.com/jpmorganchase/quorum.js/blob/master/7nodes-test/deployContractViaIpc.js) and Tessera implementation [example](https://github.com/jpmorganchase/quorum.js/blob/master/7nodes-test/deployContractViaHttp.js). An extension sample is also provided.


## Getting Help
Stuck at some step? Have no fear, the help is here: <a href="https://clh7rniov2.execute-api.us-east-1.amazonaws.com/Express/" target="_blank" rel="noopener"><img title="Quorum Slack" src="https://clh7rniov2.execute-api.us-east-1.amazonaws.com/Express/badge.svg" alt="Quorum Slack" /></a>
