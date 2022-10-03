const networkConfig = {
    default:{
        name:"hardhat",        
    },
    31337:{
        name:"localhost",
    },
    5:{
        name:"goerli",
    },
    1:{
        name:"mainnet",
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsAddressFile = "../frontend_nft_marketplace_moralis/constants/networkMapping.json"
const frontEndContractsAddressFile2 = "../frontend_nft_marketplace_subgraph/constants/networkMapping.json"
const frontEndABIDir = "../frontend_nft_marketplace_moralis/constants/"
const frontEndABIDir2 = "../frontend_nft_marketplace_subgraph/constants/"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    // frontEndContractsAddressFile,
    frontEndContractsAddressFile2,
    // frontEndABIDir,
    frontEndABIDir2,
}