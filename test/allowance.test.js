const {
  decryptedAccount,
  fromAddress,
  toAddress
} = require("./helpers/quorumConfig");

const tesseraConfig = require("./helpers/tesseraConfig");
const constellationConfig = require("./helpers/constellationConfig");

const contract = require("./resources/HumanStandardToken.json").contracts[
  "HumanStandardToken.sol:HumanStandardToken"
];

const abi = JSON.parse(contract.interface);
const code = `0x${contract.bytecode}`;

[
  {
    name: "Tessera",
    config: tesseraConfig
  },
  {
    name: "Constellation",
    config: constellationConfig
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
      const approvedQuantity = 100;
      const tokenContract = new web3.eth.Contract(abi, null, code);
      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: [100000, "web3js token", 18, "web3js"]
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
        return new web3.eth.Contract(abi, contractAddress, code);
      };

      const checkAllowance = token => {
        return token.methods
          .allowance(fromAddress, toAddress)
          .call({ from: fromAddress })
          .then(initialAllowance => {
            expect(initialAllowance).to.eql(0);
            return token;
          });
      };

      const approveAllowance = token => {
        const approveMethodPayload = token.methods
          .approve(toAddress, approvedQuantity)
          .encodeABI();

        return web3.eth
          .getTransactionCount(fromAddress)
          .then(nonce => {
            return rawTransactionManager.sendRawTransaction({
              gasPrice: 0,
              gasLimit: 4300000,
              to: token._address,
              value: 0,
              data: approveMethodPayload,
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

      const checkApprovedAllowance = token => {
        return token.methods
          .allowance(fromAddress, toAddress)
          .call({ from: fromAddress })
          .then(approvedResult => {
            expect(approvedResult).to.eql(approvedQuantity);
            return token;
          });
      };

      const getApprovedEvents = token => {
        return token.getPastEvents("Approval").then(event => {
          const eventResult = event[0].returnValues;
          expect(eventResult._owner.toLowerCase()).to.equal(fromAddress);
          expect(eventResult._spender.toLowerCase()).to.equal(toAddress);
          expect(eventResult._value).to.equal(approvedQuantity);
          return event;
        });
      };

      it("can approve allowance and fetch events", () => {
        return web3.eth
          .getTransactionCount(fromAddress)
          .then(sendTransaction)
          .then(loadToken)
          .then(checkAllowance)
          .then(approveAllowance)
          .then(checkApprovedAllowance)
          .then(getApprovedEvents);
      }).timeout(10000);
    });
  });
});
