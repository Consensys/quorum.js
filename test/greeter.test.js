const { decryptedAccount, fromAddress } = require("./helpers/quorumConfig");

const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

const contract = require("./resources/greeter.json").contracts[
  "Greeter.sol:Greeter"
];

const abi = JSON.parse(contract.abi);
const code = `0x${contract.bin}`;

const options = {
  data: code
};

[
  {
    name: "Http",
    config: httpConfig
  },
  {
    name: "Ipc",
    config: ipcConfig
  }
].forEach(testCase => {
  const {
    web3,
    toPublicKey,
    fromPublicKey,
    rawTransactionManager
  } = testCase.config;

  const tokenContract = new web3.eth.Contract(abi, null, options);

  describe(testCase.name, () => {
    describe("Greeter Contract", () => {
      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: ["Hello Tessera!"]
        })
        .encodeABI();

      const sendTransaction = nonce => {
        return rawTransactionManager
          .sendRawTransaction({
            gasPrice: 0,
            gasLimit: 4300000,
            to: "",
            value: 0,
            data: contractPayload,
            from: decryptedAccount,
            isPrivate: true,
            privateFrom: fromPublicKey,
            privateFor: [toPublicKey],
            nonce
          })
          .then(result => {
            expect(result).not.to.equal("0x");
            return result.contractAddress;
          });
      };

      const loadToken = contractAddress => {
        return new web3.eth.Contract(abi, contractAddress, options);
      };

      const greet = token => {
        return token.methods
          .greet()
          .call({
            from: fromAddress
          })
          .then(greetingResult => {
            expect(greetingResult).to.equal("Hello Tessera!");
            return token;
          });
      };

      it("can be deployed and executed", () => {
        return web3.eth
          .getTransactionCount(fromAddress)
          .then(sendTransaction)
          .then(loadToken)
          .then(greet);
      }).timeout(10000);
    });
  });
});
