const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:22000")
);

const quorumjs = require("../lib/index.js");

// Call extend to add Quorum into web3 instance
quorumjs.extend(web3);

// Example of calling Quorum specific API
web3.quorum.raft.leader().then((o, e) => {
  console.log(o, e);
});
