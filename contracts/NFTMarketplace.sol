// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NFTMarketplace__AlreadyAdded(address nftAddress, uint256 tokenId);
error NFTMarketplace__NotAdded(address nftAddress, uint256 tokenId);
error NFTMarketplace__NotOwner();
error NFTMarketplace__PriceMustBeAbove0();
error NFTMarketplace__NotApprovedForMarketplace();
error NFTMarketplace__BuyWithNotEnoughValue(address nftAddress, uint256 tokenId);
error NFTMarketplace__withdrawNoProceeds();
error NFTMarketplace__withdrawFailed();

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract NFTMarketplace is ReentrancyGuard{
    struct Item {
        address seller;
        uint256 price;
    }

    event AddedItem(
        address seller,
        address nftAddress,
        uint256 tokenId,
        uint price
    );

    event DeletedItem(address seller, address nftAddress, uint256 tokenId);    
    event BuyNFT(address buyer, address seller, address nftAddress, uint256 tokenId);    
    event WithdrawProceeds(address user, uint256 proceeds);    

    mapping(address => mapping(uint256 => Item)) private s_listItems; //tokenAddr, tokenId
    mapping(address => uint256) private s_proceeds; //userAddr, proceeds

    modifier NotAdded(address nftAddress, uint256 tokenId) {
        if (s_listItems[nftAddress][tokenId].price > 0) {
            revert NFTMarketplace__AlreadyAdded(nftAddress, tokenId);
        }
        _;
    }

    modifier AlreadyAdded(address nftAddress, uint256 tokenId) {
        if (s_listItems[nftAddress][tokenId].price <= 0) {
            revert NFTMarketplace__NotAdded(nftAddress, tokenId);
        }
        _;
    }

    modifier isNFTOwner(
        address nftAddress,
        uint256 tokenId,
        address user
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != user) {
            revert NFTMarketplace__NotOwner();
        }
        _;
    }

    function addItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        NotAdded(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NFTMarketplace__PriceMustBeAbove0();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NFTMarketplace__NotApprovedForMarketplace();
        }
        s_listItems[nftAddress][tokenId] = Item(msg.sender, price);
        emit AddedItem(msg.sender, nftAddress, tokenId, price);
    }

    function deleteItem(address nftAddress, uint256 tokenId)
        external
        AlreadyAdded(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId, msg.sender)
    {
        delete s_listItems[nftAddress][tokenId];
        emit DeletedItem(msg.sender, nftAddress, tokenId);
    }

    function modifyPrice(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        AlreadyAdded(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId, msg.sender)
    {
        if(newPrice <= 0){
            revert NFTMarketplace__PriceMustBeAbove0();
        }
        s_listItems[nftAddress][tokenId].price = newPrice;
        emit AddedItem(msg.sender, nftAddress, tokenId, newPrice);
    }

    function buyNFT(address nftAddress, uint256 tokenId) external payable AlreadyAdded(nftAddress, tokenId) nonReentrant {
        Item memory item = s_listItems[nftAddress][tokenId];
        if(item.price > msg.value){
            revert NFTMarketplace__BuyWithNotEnoughValue(nftAddress, tokenId);
        }
        IERC721 nft = IERC721(nftAddress);
        s_proceeds[item.seller] += msg.value;
        delete s_listItems[nftAddress][tokenId];
        nft.safeTransferFrom(item.seller, msg.sender, tokenId);
        emit BuyNFT(msg.sender, item.seller, nftAddress, tokenId);
    }

    function withdrawProceeds()external nonReentrant{
        uint256 proceeds = s_proceeds[msg.sender];
        if(proceeds <= 0){
            revert NFTMarketplace__withdrawNoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value:proceeds}("");
        if(!success){
            revert NFTMarketplace__withdrawFailed();
        }
        emit WithdrawProceeds(msg.sender, proceeds);
    }

    // getter
    function getAddedItem(address nftAddress, uint256 tokenId)external view returns (Item memory){
        return s_listItems[nftAddress][tokenId];
    }

    function getProceeds(address user) external view returns (uint256){
        return s_proceeds[user];
    }
}
