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

  if (allApis || apis.includes("quorumNodeMgmt")) {
    const methods = [
      {
        name: "addVoter",
        call: "quorumNodeMgmt_addVoter",
        params: 2
      },
      {
        name: "removeVoter",
        call: "quorumNodeMgmt_removeVoter",
        params: 1
      },
      {
        name: "proposeNode",
        call: "quorumNodeMgmt_proposeNode",
        params: 2
      },
      {
        name: "approveNode",
        call: "quorumNodeMgmt_approveNode",
        params: 2
      },
      {
        name: "proposeNodeDeactivation",
        call: "quorumNodeMgmt_proposeNodeDeactivation",
        params: 2
      },
      {
        name: "approveNodeDeactivation",
        call: "quorumNodeMgmt_approveNodeDeactivation",
        params: 2
      },
      {
        name: "proposeNodeActivation",
        call: "quorumNodeMgmt_proposeNodeActivation",
        params: 2
      },
      {
        name: "approveNodeActivation",
        call: "quorumNodeMgmt_approveNodeActivation",
        params: 2
      },
      {
        name: "proposeNodeBlacklisting",
        call: "quorumNodeMgmt_proposeNodeBlacklisting",
        params: 2
      },
      {
        name: "proposeNodeBlacklisting",
        call: "quorumNodeMgmt_approveNodeBlacklisting",
        params: 2
      },
      {
        name: "cancelPendingOperation",
        call: "quorumNodeMgmt_cancelPendingOperation",
        params: 2
      },
      {
        name: "voterList",
        call: "quorumNodeMgmt_voterList",
        params: 0
      },
      {
        name: "permissionNodeList",
        call: "quorumNodeMgmt_permissionNodeList",
        params: 0
      }
    ];

    web3.extend({
      property: "quorumNodeMgmt",
      methods
    });

    web3.quorum.quorumNodeMgmt = web3.quorumNodeMgmt;
  }

  if (allApis || apis.includes("quorumAcctMgmt")) {
    const methods = [
      {
        name: "setAccountAccess",
        call: "quorumAcctMgmt_setAccountAccess",
        params: 3
      },
      {
        name: "permissionAccountList",
        call: "quorumAcctMgmt_permissionAccountList",
        params: 0
      }
    ];

    web3.extend({
      property: "quorumAcctMgmt",
      methods
    });

    web3.quorum.quorumAcctMgmt = web3.quorumAcctMgmt;
  }

  if (allApis || apis.includes("quorumAcctMgmt")) {
    const methods = [
      {
        name: "setAccountAccess",
        call: "quorumAcctMgmt_setAccountAccess",
        params: 3
      },
      {
        name: "permissionAccountList",
        call: "quorumAcctMgmt_permissionAccountList",
        params: 0
      }
    ];

    web3.extend({
      property: "quorumAcctMgmt",
      methods
    });

    web3.quorum.quorumAcctMgmt = web3.quorumAcctMgmt;
  }

  if (allApis || apis.includes("quorumOrgMgmt")) {
    const methods = [
      {
        name: "addMasterOrg",
        call: "quorumOrgMgmt_addMasterOrg",
        params: 2
      },
      {
        name: "addSubOrg",
        call: "quorumOrgMgmt_addSubOrg",
        params: 3
      },
      {
        name: "addVoter",
        call: "quorumOrgMgmt_addOrgVoter",
        params: 3
      },
      {
        name: "removeVoter",
        call: "quorumOrgMgmt_removeOrgVoter",
        params: 3
      },
      {
        name: "addOrgKey",
        call: "quorumOrgMgmt_addOrgKey",
        params: 3
      },
      {
        name: "removeOrgKey",
        call: "quorumOrgMgmt_removeOrgKey",
        params: 3
      },
      {
        name: "approvePendingOp",
        call: "quorumOrgMgmt_approvePendingOp",
        params: 2
      },
      {
        name: "getPendingOpDetails",
        call: "quorumOrgMgmt_getPendingOpDetails",
        params: 1
      },
      {
        name: "getOrgVoterList",
        call: "quorumOrgMgmt_getOrgVoterList",
        params: 1
      },
      {
        name: "orgKeyInfo",
        call: "quorumOrgMgmt_orgKeyInfo",
        params: 0
      }
    ];

    web3.extend({
      property: "quorumOrgMgmt",
      methods
    });

    web3.quorum.quorumOrgMgmt = web3.quorumOrgMgmt;
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
