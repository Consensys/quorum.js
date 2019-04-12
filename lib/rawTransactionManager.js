const RLP = require("rlp");
const EthereumTx = require("ethereumjs-tx");
const GenericEnclave = require("./enclave/generic");

module.exports = (web3, enclaveOptions) => {
  const enclave = GenericEnclave(
    web3,
    enclaveOptions.ipcPath,
    enclaveOptions.publicUrl,
    enclaveOptions.privateUrl
  );

  const intToHex = int => {
    return `0x${int.toString(16)}`;
  };

  const base64toHex = str => {
    return Buffer.from(str, "base64").toString("hex");
  };

  const hexToBase64 = str => {
    return Buffer.from(str, "hex").toString("base64");
  };

  const encryptRawTransaction = ({ data, privateFrom, privateFor }) => {
    return enclave
      .storeRawRequest(hexToBase64(data.substring(2)), privateFrom, privateFor)
      .then(response => {
        return base64toHex(response.key);
      });
  };

  const encryptRawTransactionViaSendAPI = ({
    data,
    privateFrom,
    privateFor
  }) => {
    return enclave
      .storeRawRequestViaSendAPI(
        hexToBase64(data.substring(2)),
        privateFrom,
        privateFor
      )
      .then(response => {
        return base64toHex(response.key);
      });
  };

  const serializeSignedTransaction = (options, data) => {
    const rawTransaction = {
      nonce: intToHex(options.nonce),
      from: options.from,
      to: options.to,
      value: intToHex(options.value),
      gasLimit: intToHex(options.gasLimit),
      gasPrice: intToHex(options.gasPrice),
      data: `0x${data}`
    };
    const tx = new EthereumTx(rawTransaction);
    tx.sign(Buffer.from(options.from.privateKey.substring(2), "hex"));

    const serializedTx = tx.serialize();
    return `0x${serializedTx.toString("hex")}`;
  };

  const setPrivate = rawTransaction => {
    const decoded = RLP.decode(rawTransaction);
    const compareTo = Buffer.from("1c", "hex");
    if (decoded[6].compare(compareTo) === 0)
      decoded[6] = Buffer.from("26", "hex");
    else decoded[6] = Buffer.from("25", "hex");
    return RLP.encode(decoded);
  };

  const getTransactionPayload = options => {
    if (options.isPrivate) {
      if (!enclave) {
        throw new Error("No private enclave provided");
      }

      return encryptRawTransaction(options).then(encryptedPayload => {
        return encryptedPayload;
      });
    }

    return Promise.resolve(options.data);
  };

  const getTransactionPayloadViaSendAPI = options => {
    if (options.isPrivate) {
      if (!enclave) {
        throw new Error("No private enclave provided");
      }

      return encryptRawTransactionViaSendAPI(options).then(encryptedPayload => {
        return encryptedPayload;
      });
    }

    return Promise.resolve(options.data);
  };

  const storeRawRequest = (data, privateFrom) => {
    return encryptRawTransaction({ data, privateFrom });
  };

  const sendRawRequest = (payload, privateFor) => {
    return enclave.sendRawRequest(payload, privateFor);
  };

  /**
   * Should be called to send a raw private transaction via older Send API
   * This method exists to support all existing private transaction managers
   *
   * @method sendRawTransaction
   * @param {Object} options.gasPrice
   * @param {Object} options.gasLimit             Public key of the sender.
   * @param {Array<String>} options.to            Array of public keys of recipients.
   * @param {Object} options.value                Not Available for private txns.
   * @param {String} options.data                 Payload to be send to Constellation.
   * @param {Object} options.decryptedAccount     Decrypted account used to sign the transaction.
   * @param {Object} options.isPrivate
   * @param {String} options.privateFrom
   * @param {Array<String>} options.privateFor    Array of public keys to whom this tx is privateFor.
   * @param {Object} options.nonce
   * @returns {Promise}                   resolves if the raw transaction was sent successfully else rejects with error.
   */
  const sendRawTransactionViaSendAPI = options => {
    return getTransactionPayloadViaSendAPI(options).then(transactionPayload => {
      const serializedTx = serializeSignedTransaction(
        options,
        transactionPayload
      );

      const privateTx = setPrivate(serializedTx);
      // eslint-disable-next-line promise/no-nesting
      return web3.eth
        .sendSignedTransaction(
          `0x${privateTx.toString("hex")}`,
          options.privateFor
        )
        .then(result => {
          return result;
        });

      // return enclave
      //   .sendRawRequest(`0x${privateTx.toString("hex")}`, options.privateFor)
      //   .then(result => {
      //     return result;
      //   });
    });
  };

  /**
   * Should be called to send a raw private transaction
   * This method should be used with enterprise private transaction managers
   * such as Tessera
   *
   * @method sendRawTransaction
   * @param {Object} options.gasPrice
   * @param {Object} options.gasLimit             Public key of the sender.
   * @param {Array<String>} options.to            Array of public keys of recipients.
   * @param {Object} options.value                Not Available for private txns.
   * @param {String} options.data                 Payload to be send to Constellation.
   * @param {Object} options.decryptedAccount     Decrypted account used to sign the transaction.
   * @param {Object} options.isPrivate
   * @param {String} options.privateFrom
   * @param {Array<String>} options.privateFor    Array of public keys to whom this tx is privateFor.
   * @param {Object} options.nonce
   * @returns {Promise}                   resolves if the raw transaction was sent successfully else rejects with error.
   */
  const sendRawTransaction = options => {
    return getTransactionPayload(options).then(transactionPayload => {
      const serializedTx = serializeSignedTransaction(
        options,
        transactionPayload
      );

      const privateTx = setPrivate(serializedTx);
      // eslint-disable-next-line promise/no-nesting
      return enclave
        .sendRawRequest(`0x${privateTx.toString("hex")}`, options.privateFor)
        .then(result => {
          return result;
        });
    });
  };

  return {
    sendRawTransactionViaSendAPI,
    sendRawTransaction,
    setPrivate,
    sendRawRequest,
    storeRawRequest
  };
};
