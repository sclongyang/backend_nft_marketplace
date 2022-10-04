// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error BaseNFT__TokenIdNotExsit(uint256 tokenId);

contract BaseNFT is ERC721{
    string public constant TOKEN_URL = "ipfs://QmdryoExpgEQQQgJPoruwGJyZmz6SqV4FRTX1i73CT3iXn";
    uint256 private s_tokenId = 0;

    event BaseNFTMinted(address indexed owner, uint256  tokenId);

    constructor() ERC721("BaseNFT", "BNFT"){
        s_tokenId = 0;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if(!_exists(tokenId)){
            revert BaseNFT__TokenIdNotExsit(tokenId);
        }
        return TOKEN_URL;
    }

    function getTokenCounter() external view returns (uint256){
        return s_tokenId;
    }

    function mintNft() external returns (uint256){
        _safeMint(msg.sender, s_tokenId);
        emit BaseNFTMinted(msg.sender, s_tokenId);
        uint256 tokenId = s_tokenId;
        s_tokenId++;        
        return tokenId;
    }

}