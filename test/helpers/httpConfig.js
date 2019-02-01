const Web3 = require("web3");
const { address } = require("./quorumConfig");
const RawTransactionManager = require("../../lib/rawTransactionManager");
const Enclave = require("../../lib/enclave/generic");

const web3 = new Web3(new Web3.providers.HttpProvider(address));

const fromPublicKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const toPublicKey = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=";

const enclave = Enclave(
  web3,
  null,
  "http://localhost:9001",
  "http://localhost:9081"
);

const enclaveOptions = {
  ipcPath: null,
  publicUrl: "http://localhost:9001",
  privateUrl: "http://localhost:9081"
};
const rawTransactionManager = RawTransactionManager(web3, enclaveOptions);

module.exports = {
  web3,
  fromPublicKey,
  toPublicKey,
  rawTransactionManager,
  enclave
};
