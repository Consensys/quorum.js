const Web3 = require("web3");
const { address } = require("./quorumConfig");
const RawTransactionManager = require("../../lib/rawTransactionManager");
const Enclave = require("../../lib/enclave/constellation");

const web3 = new Web3(new Web3.providers.HttpProvider(address));

const fromPublicKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const toPublicKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";

const enclave = Enclave(web3, "~/constellation/data/constellation.ipc");

const rawTransactionManager = RawTransactionManager(web3, enclave);

module.exports = {
  web3,
  fromPublicKey,
  toPublicKey,
  rawTransactionManager,
  enclave
};
