const fs = require("fs")
const { ethers, network } = require("hardhat")
const { frontEndContractsAddressFile2, frontEndABIDir2 } = require("../helper-hardhat-config")

require("dotenv").config()



module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("start update frontend file")
        await UpdateABIs()
        await UpdateContractsAddress()
        console.log("succ update frontend file")
    }
}

async function UpdateABIs() {
    const baseNFT = await ethers.getContract("BaseNFT")
    // fs.writeFileSync(`${frontEndABIDir}BaseNFT.json`, baseNFT.interface.format(ethers.utils.FormatTypes.json))
    fs.writeFileSync(`${frontEndABIDir2}BaseNFT.json`, baseNFT.interface.format(ethers.utils.FormatTypes.json))

    const nftMarketplace = await ethers.getContract("NFTMarketplace")
    // fs.writeFileSync(`${frontEndABIDir}NFTMarketplace.json`, nftMarketplace.interface.format(ethers.utils.FormatTypes.json))
    fs.writeFileSync(`${frontEndABIDir2}NFTMarketplace.json`, nftMarketplace.interface.format(ethers.utils.FormatTypes.json))
}

async function UpdateContractsAddress() {
    const chainId = network.config.chainId.toString()
    const contractName = "NFTMarketplace"
    const nftMarketplace = await ethers.getContract(contractName)
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsAddressFile2, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId][`${contractName}`].includes(nftMarketplace.address)) {
            contractAddresses[chainId][`${contractName}`].unshift(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { "NFTMarketplace": [nftMarketplace.address] }
    }
    // fs.writeFileSync(frontEndContractsAddressFile, JSON.stringify(contractAddresses))
    fs.writeFileSync(frontEndContractsAddressFile2, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]