const rp = require("request-promise-native");
const url = require("url");
const fs = require("fs");

module.exports = (web3, ipcPath, publicUrl, privateUrl) => {
  const socketRoot = `http://unix:${ipcPath}:`;
  const privateEndpoint = ipcPath ? socketRoot : privateUrl;
  const publicEndpoint = ipcPath ? socketRoot : privateUrl;

  const sleep = ms => {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(resolve => {
      return setTimeout(resolve, ms);
    });
  };

  // Add extra logic for inserting ssl for https ... ignore for http
  const { protocol } = url.parse(privateUrl);
  let clientKey;
  let clientCert;
  let cacert;
  const path = "./certs/";

  if (protocol === "https:") {
    if (fs.existsSync(`${path}cert.key`)) {
      clientKey = fs.readFileSync(`${path}cert.key`);
    }

    if (fs.existsSync(`${path}cert.pem`)) {
      clientCert = fs.readFileSync(`${path}cert.pem`);
    }

    if (fs.existsSync(`${path}cacert.pem`)) {
      cacert = fs.readFileSync(`${path}cacert.pem`);
    }
  }

  const retry = (operation, delay, times) => {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      return operation()
        .then(resolve)
        .catch(reason => {
          if (times - 1 > 0) {
            // eslint-disable-next-line promise/no-nesting
            return sleep(delay)
              .then(retry.bind(null, operation, delay, times - 1))
              .then(resolve)
              .catch(reject);
          }
          return reject(reason);
        });
    });
  };

  const getTransactionReceipt = txHash => {
    return web3.eth.getTransactionReceipt(txHash).then(txReceipt => {
      if (txReceipt) {
        return txReceipt;
      }
      throw new Error("Can't get transaction receipt");
    });
  };

  const sendRawRequest = (payload, privateFor) => {
    const sendRawPrivateTransactionRequest = {
      method: "POST",
      // eslint-disable-next-line no-underscore-dangle
      uri: web3.eth.currentProvider.host,
      json: true,
      body: {
        jsonrpc: "2.0",
        method: "eth_sendRawPrivateTransaction",
        params: [payload, { privateFor }],
        id: "1"
      }
    };

    return rp(sendRawPrivateTransactionRequest).then(res => {
      return retry(
        () => {
          return getTransactionReceipt(res.result);
        },
        100,
        100
      );
    });
  };

  return {
    sendRawRequest,
    storeRawRequest: (payload, from) => {
      const options = {
        method: "POST",
        uri: `${privateUrl}/storeraw`,
        json: true,
        body: { payload, from },
        key: clientKey,
        cert: clientCert,
        ca: cacert,
        rejectUnauthorized: false
      };

      return rp(options);
    },
    storeRawRequestViaSendAPI: (payload, from, to) => {
      const options = {
        method: "POST",
        uri: `${privateEndpoint}/send`,
        json: true,
        body: { payload, from, to },
        key: clientKey,
        cert: clientCert,
        ca: cacert,
        rejectUnauthorized: false
      };

      return rp(options);
    },
    receiveRequest: (key, to) => {
      const options = {
        method: "POST",
        uri: `${privateEndpoint}/receive`,
        json: true,
        body: { key, to },
        key: clientKey,
        cert: clientCert,
        ca: cacert,
        rejectUnauthorized: false
      };

      return rp(options);
    },
    deleteRequest: key => {
      const options = {
        method: "POST",
        uri: `${publicEndpoint}/delete`,
        json: true,
        body: { key }
      };

      return rp(options);
    },
    upCheck: () => {
      const options = {
        method: "GET",
        uri: `${publicEndpoint}/upcheck`
      };

      return rp(options);
    }
  };
};
