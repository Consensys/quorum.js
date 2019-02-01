const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

[
  {
    name: "Http",
    config: httpConfig
  },
  {
    name: "Ipc",
    config: ipcConfig
  }
].forEach(testCase => {
  const { enclave } = testCase.config;

  describe(testCase.name, () => {
    it("can connect to upcheck", () => {
      return enclave.upCheck("9001").then(res => {
        return expect(res).to.equal("I'm up!");
      });
    });
  });
});
