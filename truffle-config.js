const path = require("path");

module.exports = {
  compilers: {
    solc: {
      version: "0.6.7",
    },
  },
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/b674027123a048879833476945bcd4a5");
      },
      network_id: '3',
      from: '0x96e15945Eff585e9Fa3c9eCC9418c624AEd18EcE',
    },
  },
};
