// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error BaseNFT2__TokenIdNotExsit(uint256 tokenId);

contract BaseNFT2 is ERC721{
    string public constant TOKEN_URL = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_tokenId = 0;

    event BaseNFT2Minted(address indexed owner, uint256 tokenId);

    constructor() ERC721("BaseNFT2", "BNFT"){
        s_tokenId = 0;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if(!_exists(tokenId)){
            revert BaseNFT2__TokenIdNotExsit(tokenId);
        }
        return TOKEN_URL;
    }

    function getTokenCounter() external view returns (uint256){
        return s_tokenId;
    }

    function mintNft() external returns (uint256){
        _safeMint(msg.sender, s_tokenId);
        emit BaseNFT2Minted(msg.sender, s_tokenId);
        uint256 tokenId = s_tokenId;
        s_tokenId++;        
        return tokenId;
    }

}