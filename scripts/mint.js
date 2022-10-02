const { ethers, network } = require("hardhat")
const { moveBlock } = require("../utils/move_block")

async function mint() {
    const baseNFT = await ethers.getContract("BaseNFT2")
    const tx = await baseNFT.mintNft()
    const txReceipt = await tx.wait(1)
    console.log(`BaseNFT2 addr: ${baseNFT.address}, minted tokenId: ${txReceipt.events[0].args.tokenId}`)
    if(network.config.chainId == 31337){
        await moveBlock(1, 1000)
    }}

mint().then((resolve) => process.exit(0)).catch((e) => {
    console.log(e)
})