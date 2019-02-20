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

web3.quorum.quorumNodeMgmt.permissionNodeList().then((o, e) => {
  // console.log("node list:" + o + " , error " + e)
  for (let i = 0; i < o.length; ++i) {
    console.log(`----${i}-> { enodeId:${o[i].enodeId}, status:${o[i].status}}`);
  }
  console.log(`1 ->${JSON.stringify(o, null, 2)}`);
});
console.log("-----------------------------");
/* web3.quorum.quorumNodeMgmt.addVoter("0xed9d02e382b34818e88b88a309c7fe71e65f419d",{from:"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}).
  then((o,e) => {
    console.log("error ", e)
  console.log(JSON.stringify(o, null, 2))
}) */
console.log("-----------------------------");
web3.quorum.quorumNodeMgmt.voterList().then((o, e) => {
  console.log(`2 ->${JSON.stringify(o, null, 2)}`);
});
console.log("-----------------------------");
web3.quorum.quorumAcctMgmt.permissionAccountList().then((o, e) => {
  console.log(`3 -> ${JSON.stringify(o, null, 2)}`);
});
console.log("-----------------------------");
web3.quorum.quorumOrgMgmt.orgKeyInfo().then((o, e) => {
  console.log(`4 -> ${JSON.stringify(o, null, 2)}`);
});
