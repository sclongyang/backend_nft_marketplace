const { network } = require("hardhat")
const { networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS

    arguments = []
    console.log("begin deploy NFTMarketplace")
    const nftMarketplace = await deploy("NFTMarketplace",
        {
            from: deployer,
            args: arguments,
            log: true,
            waitConfirmations: waitBlockConfirmations,
        }
    )
    console.log(`fermi deploy marketpalce address: ${nftMarketplace.address}`)
    
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(nftMarketplace.address, arguments)        
    }
    console.log("------------------------------")    
}

module.exports.tags = ["all", "nftmarketplace"]
