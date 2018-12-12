const tesseraConfig = require("./helpers/tesseraConfig");
const constellationConfig = require("./helpers/constellationConfig");

[
  {
    name: "Tessera",
    config: tesseraConfig
  },
  {
    name: "Constellation",
    config: constellationConfig
  }
].forEach(testCase => {
  const { enclave } = testCase.config;

  describe(testCase.name, () => {
    it("can connect to upcheck", () => {
      return enclave.upCheck("8080").then(res => {
        return expect(res).to.equal("I'm up!");
      });
    });

    it("can send raw transaction", () => {
      return enclave
        .storeRawRequest("cGF5bG9hZAo=", testCase.config.fromPublicKey, [
          testCase.config.toPublicKey
        ])
        .then(res => {
          return expect(res.key.length).to.be.equal(88);
        });
    });
  });
});
