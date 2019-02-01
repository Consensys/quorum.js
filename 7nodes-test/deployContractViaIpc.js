const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:22000")
);

const quorumjs = require("../lib/index.js");

const accAddress = "ed9d02e382b34818e88b88a309c7fe71e65f419d";

const signAcct = web3.eth.accounts.decrypt(
  {
    address: accAddress,
    crypto: {
      cipher: "aes-128-ctr",
      ciphertext:
        "4e77046ba3f699e744acb4a89c36a3ea1158a1bd90a076d36675f4c883864377",
      cipherparams: { iv: "a8932af2a3c0225ee8e872bc0e462c11" },
      kdf: "scrypt",
      kdfparams: {
        dklen: 32,
        n: 262144,
        p: 1,
        r: 8,
        salt: "8ca49552b3e92f79c51f2cd3d38dfc723412c212e702bd337a3724e8937aff0f"
      },
      mac: "6d1354fef5aa0418389b1a5d1f5ee0050d7273292a1171c51fd02f9ecff55264"
    },
    id: "a65d1ac3-db7e-445d-a1cc-b6c5eeaa05e0",
    version: 3
  },
  ""
);

const abi = [
  {
    constant: true,
    inputs: [],
    name: "storedData",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "x", type: "uint256" }],
    name: "set",
    outputs: [],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "get",
    outputs: [{ name: "retVal", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    inputs: [{ name: "initVal", type: "uint256" }],
    payable: false,
    type: "constructor"
  }
];

const bytecode =
  "0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029";

const simpleContract = new web3.eth.Contract(abi);

const bytecodeWithInitParam = simpleContract
  .deploy({ data: bytecode, arguments: [42] })
  .encodeABI();

const ipcPath = process.env.IPC_PATH;

if (ipcPath == null) {
  console.log("Please specify ipc path");
  process.exit();
}

const rawTransactionManager = quorumjs.RawTransactionManager(web3, {
  ipcPath
});

web3.eth.getTransactionCount(`0x${accAddress}`).then(txCount => {
  const newTx = rawTransactionManager.sendRawTransactionViaSendAPI({
    gasPrice: 0,
    gasLimit: 4300000,
    to: "",
    value: 0,
    data: bytecodeWithInitParam,
    from: signAcct,
    isPrivate: true,
    privateFrom: "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=",
    privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="],
    nonce: txCount
  });

  newTx
    .then(tx => {
      console.log("Contract address: ", tx.contractAddress);
      const simpleContract2 = new web3.eth.Contract(abi, tx.contractAddress);
      simpleContract2.methods
        .get()
        .call()
        .then(console.log)
        .catch(console.log);
      return simpleContract2;
    })
    .catch(console.log);
});
