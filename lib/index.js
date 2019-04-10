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
        call: `${prefix}getValdators`,
        params: 1
      },
      {
        name: "getValdatorsAtHash",
        call: `${prefix}getValdatorsAtHash`,
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

  if (allApis || apis.includes("quorumPermission")) {
    const methods = [
      {
        name: "orgList",
        call: "quorumPermission_orgList",
        params: 0
      },
      {
        name: "nodeList",
        call: "quorumPermission_nodeList",
        params: 0
      },
      {
        name: "roleList",
        call: "quorumPermission_roleList",
        params: 0
      },
      {
        name: "acctList",
        call: "quorumPermission_acctList",
        params: 0
      },
      {
        name: "getOrgDetail",
        call: "quorumPermission_getOrgDetails",
        params: 1
      },
      {
        name: "addOrg",
        call: "quorumPermission_addOrg",
        params: 3
      },
      {
        name: "approveOrg",
        call: "quorumPermission_approveOrg",
        params: 3
      },
      {
        name: "updateOrgStatus",
        call: "quorumPermission_updateOrgStatus",
        params: 3
      },
      {
        name: "approveOrgStatus",
        call: "quorumPermission_approveOrgStatus",
        params: 3
      },
      {
        name: "addNode",
        call: "quorumPermission_addNode",
        params: 3
      },
      {
        name: "updateNodeStatus",
        call: "quorumPermission_updateNodeStatus",
        params: 4
      },
      {
        name: "assignOrgAdminAccount",
        call: "quorumPermission_assignOrgAdminAccount",
        params: 3
      },
      {
        name: "approveOrgAdminAccount",
        call: "quorumPermission_approveOrgAdminAccount",
        params: 2
      },
      {
        name: "addNewRole",
        call: "quorumPermission_addNewRole",
        params: 5
      },
      {
        name: "removeRole",
        call: "quorumPermission_removeRole",
        params: 3
      },
      {
        name: "assignAccountRole",
        call: "quorumPermission_assignAccountRole",
        params: 4
      }
    ];

    web3.extend({
      property: "quorumPermission",
      methods
    });

    web3.quorum.quorumPermission = web3.quorumPermission;
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
