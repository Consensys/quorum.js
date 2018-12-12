const RLP = require("rlp");
const EthereumTx = require("ethereumjs-tx");

module.exports = (web3, enclave) => {
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

  /**
   * Should be called to send a raw transaction
   *
   * @method sendRawTransaction
   * @param {Object} options.gasPrice             Payload to be send to Constellation.
   * @param {Object} options.gasLimit             Public key of the sender.
   * @param {Array<String>} options.to            Array of public keys of recipients.
   * @param {Object} options.value
   * @param {String} options.data
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
      if (options.isPrivate) {
        const privateTx = setPrivate(serializedTx);
        // eslint-disable-next-line promise/no-nesting
        return web3
          .sendRawRequest(`0x${privateTx.toString("hex")}`, options.privateFor)
          .then(result => {
            return result;
          });
      }

      return web3.sendRawRequest(serializedTx.toString("hex"));
    });
  };

  return {
    sendRawTransaction
  };
};
