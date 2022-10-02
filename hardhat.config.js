/** @type import('hardhat/config').HardhatUserConfig */

const { privateEncrypt } = require('crypto')

require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

// set proxy
const proxyUrl = 'http://127.0.0.1:7890';   // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);

const REPORT_GAS = process.env.REPORT_GAS || false
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_USER = process.env.PRIVATE_KEY_USER

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
    localhost: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      url: GOERLI_RPC_URL,
      accounts: (PRIVATE_KEY !== undefined && PRIVATE_KEY_USER !== undefined) ? [PRIVATE_KEY, PRIVATE_KEY_USER] : [],
      saveDeployments: true,
    },
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
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
    }
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
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};
