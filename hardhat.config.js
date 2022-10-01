/** @type import('hardhat/config').HardhatUserConfig */

require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("@nomiclabs/hardhat-waffle")

const REPORT_GAS = process.env.REPORT_GAS || false

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.7" },
    ],
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // localhost:{
    //   chainId:31337,

    // },
    // goerli:{
    //   chainId:5,

    // },
    // mainnet:{
    //   chainId:1,
    // },
  },
  contractSizer: {
    runOnCompile: false,
    only: ["NFTMarketplace"],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
},
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
      5: 0,
    },
    user: {
      default: 1,
      1: 1,
      5: 1,
    },
  },
};
