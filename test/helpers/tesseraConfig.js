const Web3 = require("web3");
const { address } = require("./quorumConfig");
const RawTransactionManager = require("../../lib/rawTransactionManager");
const Enclave = require("../../lib/enclave/tessera");

const web3 = new Web3(new Web3.providers.HttpProvider(address));

const fromPublicKey = "/+UuD63zItL1EbjxkKUljMgG8Z1w0AJ8pNOR4iq2yQc=";
const toPublicKey = "yGcjkFyZklTTXrn8+WIkYwicA2EGBn9wZFkctAad4X0=";

const enclave = Enclave(web3, "http://localhost:8080", "http://localhost:8090");
const rawTransactionManager = RawTransactionManager(web3, enclave);

module.exports = {
  web3,
  fromPublicKey,
  toPublicKey,
  rawTransactionManager,
  enclave
};
