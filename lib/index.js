const RawTransactionManager = require('./rawTransactionManager');
const Web3 = require('web3');

const _ = require('underscore');

const extend = function (web3, apis) {
  const quorumOutputBlockFormatter = function (block) {

    // Transform to number
    block.gasLimit = web3.utils.hexToNumber(block.gasLimit);
    block.gasUsed = web3.utils.hexToNumber(block.gasUsed);
    block.size = web3.utils.hexToNumber(block.size);
    block.timestamp = web3.utils.hexToNumberString(block.timestamp);
    if (block.number !== null)
      block.number = web3.utils.hexToNumber(block.number);

    if (block.difficulty)
      block.difficulty = web3.extend.formatters.outputBigNumberFormatter(block.difficulty);
    if (block.totalDifficulty)
      block.totalDifficulty = web3.extend.formatters.outputBigNumberFormatter(block.totalDifficulty);

    if (_.isArray(block.transactions)) {
      block.transactions.forEach(function (item) {
        if (!_.isString(item))
          return web3.extend.formatters.outputTransactionFormatter(item);
      });
    }

    if (block.miner)
      block.miner = web3.utils.toChecksumAddress(block.miner);

    return block;
  };

  // Patching getBlock and getBlockByNumber due to raft timestamp errors
  web3.extend({
    property: 'eth',
    methods: [{
      name: 'getBlockByNumber',
      call: 'eth_getBlockByNumber',
      params: 2,
      inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter, function (val) {
        return !!val;
      }],
      outputFormatter: quorumOutputBlockFormatter
    }]
  });

  var blockCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
  };

  web3.extend({
    property: 'eth',
    methods: [{
      name: 'getBlock',
      call: blockCall,
      params: 2,
      inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter, function (val) {
        return !!val;
      }],
      outputFormatter: quorumOutputBlockFormatter
    }]
  });

  // Creating a modified 'newBlockHeaders' subscription to replace the output formatter in the case of Quorum
  var Subscriptions = require('web3-core-subscriptions').subscriptions;

  const patchedSub = new Subscriptions({
    name: 'subscribe',
    type: 'eth',
    subscriptions: {
      'newBlockHeaders': {
        subscriptionName: 'newHeads',
        params: 0,
        outputFormatter: quorumOutputBlockFormatter
      }
    }
  });

  let _quorumSubObject = {};
  patchedSub.setRequestManager(web3._requestManager);
  patchedSub.attachToObject(_quorumSubObject);


  let allApis = false;

  if (!apis) {
    allApis = true;
  }

  // eslint-disable-next-line
  web3.quorum = {};

  if (allApis || apis.includes('raft')) {
    const methods = [
      {
        name: 'addPeer',
        call: 'raft_addPeer',
        params: 1
      },
      {
        name: 'removePeer',
        call: 'raft_removePeer',
        params: 1
      },
      {
        name: 'getRole',
        call: 'raft_role',
        params: 0
      },
      {
        name: 'leader',
        call: 'raft_leader',
        params: 0
      },
      {
        name: 'cluster',
        call: 'raft_cluster',
        params: 0
      }
    ];

    web3.extend({
      property: 'raft',
      methods
    });

    // eslint-disable-next-line
    web3.quorum.raft = web3.raft;
  }

  if (allApis || apis.includes('istanbul')) {
    const prefix = 'istanbul_';

    const methods = [
      {
        name: 'getSnapshot',
        call: `${prefix}getSnapshot`,
        params: 1
      },
      {
        name: 'getSnapshotAtHash',
        call: `${prefix}getSnapshotAtHash`,
        params: 1
      },
      {
        name: 'getValidators',
        call: `${prefix}getValidators`,
        params: 1
      },
      {
        name: 'getValidatorsAtHash',
        call: `${prefix}getValidatorsAtHash`,
        params: 1
      },
      {
        name: 'propose',
        call: `${prefix}propose`,
        params: 2
      },
      {
        name: 'discard',
        call: `${prefix}discard`,
        params: 1
      },
      {
        name: 'candidates',
        call: `${prefix}candidates`,
        params: 0
      }
    ];

    web3.extend({
      property: 'istanbul',
      methods
    });

    // eslint-disable-next-line
    web3.quorum.istanbul = web3.istanbul;
  }

  if (allApis || apis.includes("quorumPermission")) {
    const methods = [
      {
        name: 'addOrg',
        call: 'quorumPermission_addOrg',
        params: 4
      },
      {
        name: 'approveOrg',
        call: 'quorumPermission_approveOrg',
        params: 4
      },
      {
        name: 'addSubOrg',
        call: 'quorumPermission_addSubOrg',
        params: 4
      },
      {
        name: 'updateOrgStatus',
        call: 'quorumPermission_updateOrgStatus',
        params: 3
      },
      {
        name: 'approveOrgStatus',
        call: 'quorumPermission_approveOrgStatus',
        params: 3
      },
      {
        name: 'addNode',
        call: 'quorumPermission_addNode',
        params: 3
      },
      {
        name: 'updateNodeStatus',
        call: 'quorumPermission_updateNodeStatus',
        params: 4
      },
      {
        name: 'assignAdminRole',
        call: 'quorumPermission_assignAdminRole',
        params: 4
      },
      {
        name: 'approveAdminRole',
        call: 'quorumPermission_approveAdminRole',
        params: 3
      },
      {
        name: 'addNewRole',
        call: 'quorumPermission_addNewRole',
        params: 6
      },
      {
        name: 'removeRole',
        call: 'quorumPermission_removeRole',
        params: 3
      },
      {
        name: 'addAccountToOrg',
        call: 'quorumPermission_addAccountToOrg',
        params: 4
      },
      {
        name: 'changeAccountRole',
        call: 'quorumPermission_changeAccountRole',
        params: 4
      },
      {
        name: 'updateAccountStatus',
        call: 'quorumPermission_updateAccountStatus',
        params: 4
      },
      {
        name: 'recoverBlackListedNode',
        call: 'quorumPermission_recoverBlackListedNode',
        params: 3
      },
      {
        name: 'approveBlackListedNodeRecovery',
        call: 'quorumPermission_approveBlackListedNodeRecovery',
        params: 3
      },
      {
        name: 'recoverBlackListedAccount',
        call: 'quorumPermission_recoverBlackListedAccount',
        params: 3
      },
      {
        name: 'approveBlackListedAccountRecovery',
        call: 'quorumPermission_approveBlackListedAccountRecovery',
        params: 3
      },
      {
        name: 'getOrgDetails',
        call: 'quorumPermission_getOrgDetails',
        params: 1
      },
      {
        name: 'orgList',
        call: 'quorumPermission_orgList',
        params: 0
      },
      {
        name: 'nodeList',
        call: 'quorumPermission_nodeList',
        params: 0
      },
      {
        name: 'roleList',
        call: 'quorumPermission_roleList',
        params: 0
      },
      {
        name: 'acctList',
        call: 'quorumPermission_acctList',
        params: 0
      }

    ];

    web3.extend({
      property: "quorumPermission",
      methods
    });

    web3.quorum.quorumPermission = web3.quorumPermission;
  }

  if (allApis || apis.includes('eth')) {
    const methods = [
      {
        name: 'sendRawPrivateTransaction',
        call: 'eth_sendRawPrivateTransaction',
        params: 2
      },
      {
        name: 'storageRoot',
        call: 'eth_storageRoot',
        params: 2,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter, null]
      },
      {
        name: 'getQuorumPayload',
        call: 'eth_getQuorumPayload',
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
      getQuorumPayload: web3.eth.getQuorumPayload,

      // Applying patched subcribe method
      subscribe: function () {
        const args = Array.prototype.slice.call(arguments);
        if (args.length === 0) {
          throw new Error('subscription type must be provided');
        }

        const type = args[0];

        if (type === 'newBlockHeaders') {
          // Patch output formatter
          return _quorumSubObject.subscribe.apply(web3.eth, args);
        } else {
          return web3.eth.subscribe.apply(web3.eth, args);
        }
      }
    };
  }
};

module.exports = {
  extend,
  RawTransactionManager
};
