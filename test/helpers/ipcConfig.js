const Web3 = require("web3");
const { address } = require("./quorumConfig");
const RawTransactionManager = require("../../lib/rawTransactionManager");
const Enclave = require("../../lib/enclave/generic");

const web3 = new Web3(new Web3.providers.HttpProvider(address));

const fromPublicKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const toPublicKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";

const ipcPath = process.env.IPC_PATH;

const enclave = Enclave(web3, ipcPath, null, null);

const enclaveOptions = {
  ipcPath,
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
