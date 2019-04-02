const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:22000")
);

const quorumjs = require("../lib/index.js");

// Call extend to add Quorum into web3 instance
quorumjs.extend(web3);
console.log("h1");
// Example of calling Quorum specific API
// web3.quorum.raft.leader().then((o, e) => {
//  console.log(o, e);
// });

/* web3.quorum.quorumNodeMgmt.addVoter("0xed9d02e382b34818e88b88a309c7fe71e65f419d",{from:"0xed9d02e382b34818e88b88a309c7fe71e65f419d"}).
  then((o,e) => {
    console.log("error ", e)
  console.log(JSON.stringify(o, null, 2))
}) */
console.log("-----------------------------");
/* web3.quorum.quorumPermission.addOrg("JAS","NODE5",{from:"0xed9d02e382b34818e88b88a309c7fe71e65f419d",gas:"0xfffff"}).then((o, e) => {
  console.log("h2")
  console.log(`2 ->${JSON.stringify(o, null, 2)}`);
}); */

web3.quorum.quorumPermission.nodeList().then((o, e) => {
  console.log(`3 -> ${JSON.stringify(o, null, 2)}`);
});
