const RawTransactionManager = require("./rawTransactionManager");

const extend = function(web3, apis) {
  let allApis = false;

  if (!apis) {
    allApis = true;
  }

  // eslint-disable-next-line
  web3.quorum = {};

  if (allApis || apis.includes("raft")) {
    const methods = [
      {
        name: "addPeer",
        call: "raft_addPeer",
        params: 1
      },
      {
        name: "removePeer",
        call: "raft_removePeer",
        params: 1
      },
      {
        name: "getRole",
        call: "raft_role",
        params: 0
      },
      {
        name: "leader",
        call: "raft_leader",
        params: 0
      },
      {
        name: "cluster",
        call: "raft_cluster",
        params: 0
      }
    ];

    web3.extend({
      property: "raft",
      methods
    });

    // eslint-disable-next-line
    web3.quorum.raft = web3.raft;
  }

  if (allApis || apis.includes("istanbul")) {
    const prefix = "istanbul_";

    const methods = [
      {
        name: "getSnapshot",
        call: `${prefix}getSnapshot`,
        params: 1
      },
      {
        name: "getSnapshotAtHash",
        call: `${prefix}getSnapshotAtHash`,
        params: 1
      },
      {
        name: "getValdators",
        call: `${prefix}getValidators`,
        params: 1
      },
      {
        name: "getValdatorsAtHash",
        call: `${prefix}getValidatorsAtHash`,
        params: 1
      },
      {
        name: "propose",
        call: `${prefix}propose`,
        params: 2
      },
      {
        name: "discard",
        call: `${prefix}discard`,
        params: 1
      },
      {
        name: "candidates",
        call: `${prefix}candidates`,
        params: 0
      }
    ];

    web3.extend({
      property: "istanbul",
      methods
    });

    // eslint-disable-next-line
    web3.quorum.istanbul = web3.istanbul;
  }

  if (allApis || apis.includes("eth")) {
    const methods = [
      {
        name: "sendRawPrivateTransaction",
        call: "eth_sendRawPrivateTransaction",
        params: 2
      },
      {
        name: "storageRoot",
        call: "eth_storageRoot",
        params: 2,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter, null]
      },
      {
        name: "getQuorumPayload",
        call: "eth_getQuorumPayload",
        params: 1
      }
    ];

    web3.eth.extend({
      methods
    });

    // eslint-disable-next-line
    web3.quorum.eth = {
      sendRawPrivateTransaction: web3.eth.sendRawPrivateTransaction,
      storageRoot: web3.eth.storageRoot,
      getQuorumPayload: web3.eth.getQuorumPayload
    };
  }
};

module.exports = {
  extend,
  RawTransactionManager
};
