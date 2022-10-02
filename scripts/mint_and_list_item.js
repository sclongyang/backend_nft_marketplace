const { ethers, network } = require("hardhat");
const { moveBlock } = require("../utils/move_block")

const PRICE = ethers.utils.parseEther("0.01")
async function mintAndList() {
    const baseNFT = await ethers.getContract("BaseNFT")
    const nftMarketplace = await ethers.getContract("NFTMarketplace")
    console.log(`baseNFT addr:${baseNFT.address}`)
    console.log(`NFTMarketplace addr:${nftMarketplace.address}`)
    console.log("begin mint nft")
    const nftTx = await baseNFT.mintNft()
    const mintTxReceipt = await nftTx.wait(1)
    const tokenId = await mintTxReceipt.events[0].args.tokenId
    console.log(`nft tokenId:${tokenId}`)
    console.log("begain approve nft")
    const approveTx = await baseNFT.approve(nftMarketplace.address, tokenId)
    await approveTx.wait(1)
    console.log("list item")
    const listTx = await nftMarketplace.addItem(baseNFT.address, tokenId, PRICE)
    await listTx.wait(1)
    console.log("item listed")
    if (network.config.chainId == 31337) {
        await moveBlock(1, 1000)
    }
    console.log(`curBlockNum:${await ethers.provider.getBlockNumber()}`)
}

mintAndList().then(() => {
    process.exit(0)
}).catch((e) => {
    console.log(e)
})