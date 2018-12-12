const rp = require("request-promise-native");

module.exports = (web3, path) => {
  const socketRoot = `http://unix:${path}:`;

  return {
    sendRawRequest: web3.eth.sendSignedTransaction,
    storeRawRequest: (payload, from, to) => {
      const options = {
        method: "POST",
        uri: `${socketRoot}/send`,
        json: true,
        body: { payload, from, to }
      };

      return rp(options);
    },
    receiveRequest: (key, to) => {
      const options = {
        method: "POST",
        uri: `${socketRoot}/receive`,
        json: true,
        body: { key, to }
      };

      return rp(options);
    },
    deleteRequest: key => {
      const options = {
        method: "POST",
        uri: `${socketRoot}/delete`,
        json: true,
        body: { key }
      };

      return rp(options);
    },
    upCheck: () => {
      const options = {
        method: "POST",
        uri: `${socketRoot}/upcheck`
      };

      return rp(options);
    }
  };
};
