# quorum.js: JavaScript API for Quorum

quorum.js is an extension for [web3.js](https://github.com/ethereum/web3.js/) which adds support for APIs specific to [Quorum](https://github.com/jpmorganchase/quorum).

## Features

-   Support for Quorum's private transactions through private transaction manager
-   Ability to send **signed** private transactions
-   Works out the box with web3.js' 
    [smart contract wrappers](https://docs.web3j.io/smart_contracts/#solidity-smart-contract-wrappers)
-   Provides web3 extension for all Quorum specific APIs

## Requirements
* [Node.js](https://nodejs.org/en/)
* [Running Quorum & Privacy Manager nodes](https://docs.goquorum.com/en/latest/Getting%20Started/Getting%20Started%20Overview/)

## Installation
```shell
npm install quorum-js
```

## Quickstart
The Quorum-specific API methods provided by quorum.js are accessed in one of two ways: 
### Extending web3 object
```js
const Web3 = require("web3");
const quorumjs = require("quorum-js");

const web3 = new Web3("http://localhost:22000");

quorumjs.extend(web3);

web3.quorum.eth.sendRawPrivateTransaction(signedTx, args);
```

This makes some of the Quorum-specific API methods available through the `web3.quorum` object. 

### Creating RawTransactionManager object
Some of the Quorum-specific APIs require the configuration of a [Privacy Manager](https://docs.goquorum.com/en/latest/Privacy/Privacy-Manager/):
```js
const Web3 = require("web3");
const quorumjs = require("quorum-js");

const web3 = new Web3("http://localhost:22000");

const enclaveOptions = {
  /* at least one enclave option must be provided     */
  /* ipcPath is preferred for utilizing older API     */
  /* Constellation only supports ipcPath              */
  /* For Tessera: privateUrl is ThirdParty server url */
  ipcPath: "/quorum-examples/examples/7nodes/qdata/c1/tm.ipc",
  publicUrl: "http://localhost:8080",
  privateUrl: "http://localhost:8090"
};

const txnMngr = quorumjs.RawTransactionManager(web3, enclaveOptions);

txnMngr.sendRawTransaction(args);
``` 

## Examples
The [7nodes-test](7nodes-test) directory contains examples of quorum.js usage.  These scripts can be tested with a running [7nodes test network](https://github.com/jpmorganchase/quorum-examples/tree/master/examples/7nodes).

## Getting Help
Stuck at some step? Please join our <a href="https://www.goquorum.com/slack-inviter" target="_blank" rel="noopener">slack community</a> for support.

