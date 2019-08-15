const {
  decryptedAccount,
  fromAddress,
  toAddress
} = require("./helpers/quorumConfig");

const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

const contract = require("./resources/HumanStandardToken.json").contracts[
  "HumanStandardToken.sol:HumanStandardToken"
];

const abi = JSON.parse(contract.interface);
const code = `0x${contract.bytecode}`;

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
  describe(testCase.name, () => {
    const {
      web3,
      toPublicKey,
      fromPublicKey,
      rawTransactionManager
    } = testCase.config;

    describe("Human Standard Contract", () => {
      const transferQty = 160;
      const totalSupplyQty = 100000;
      const tokenContract = new web3.eth.Contract(abi, null, options);

      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: [totalSupplyQty, "web3js token", 18, "web3js"]
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

      const checkTotalSupply = token => {
        return token.methods
          .totalSupply()
          .call({ from: fromAddress })
          .then(supply => {
            expect(supply).to.eql(totalSupplyQty);
            return token;
          });
      };

      const checkBalance = token => {
        return token.methods
          .balanceOf(fromAddress)
          .call({ from: fromAddress })
          .then(result => {
            expect(result.balance).to.eql(totalSupplyQty);
            return token;
          });
      };

      const transfer = token => {
        const transferAbi = token.methods
          .transfer(toAddress, transferQty)
          .encodeABI();

        return web3.eth
          .getTransactionCount(fromAddress)
          .then(nonce => {
            return rawTransactionManager.sendRawTransaction({
              gasPrice: 0,
              gasLimit: 4300000,
              to: token.address,
              value: 0,
              data: transferAbi,
              from: decryptedAccount,
              isPrivate: true,
              privateFrom: fromPublicKey,
              privateFor: [toPublicKey],
              nonce
            });
          })
          .then(() => {
            return token;
          });
      };

      const checkBalanceAlice = token => {
        return token.methods
          .balanceOf(fromAddress)
          .call({ from: fromAddress })
          .then(result => {
            const remainingQty = totalSupplyQty - transferQty;
            expect(result.balance).to.eql(remainingQty);
            return token;
          });
      };

      const checkBalanceBob = token => {
        return token.methods
          .balanceOf(toAddress)
          .call({ from: toAddress })
          .then(result => {
            expect(result.balance).to.eql(transferQty);
            return token;
          });
      };

      it("can transfer funds with private payload", () => {
        return web3.eth
          .getTransactionCount(fromAddress)
          .then(sendTransaction)
          .then(loadToken)
          .then(checkTotalSupply)
          .then(checkBalance)
          .then(transfer)
          .then(checkBalanceAlice)
          .then(checkBalanceBob);
      }).timeout(10000);
    });
  });
});
