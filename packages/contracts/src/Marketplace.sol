// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard, ERC721Holder {
    IERC20 public paymentToken;
    uint256 public feePercentage; // Basis points (e.g., 250 = 2.5%)
    address public feeRecipient;

    struct Listing {
        address seller;
        uint256 price;
    }

    // NFT Contract => Token ID => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    constructor(
        address _initialOwner,
        address _paymentToken,
        uint256 _feePercentage,
        address _feeRecipient
    ) Ownable(_initialOwner) {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        paymentToken = IERC20(_paymentToken);
        feePercentage = _feePercentage;
        feeRecipient = _feeRecipient;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            listings[nftContract][tokenId].seller == address(0),
            "NFT already listed"
        );
        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price
        });

        emit ItemListed(msg.sender, nftContract, tokenId, price);
    }

    function buyNFT(
        address nftContract,
        uint256 tokenId
    ) external nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.price > 0, "Item not listed");
        require(
            IERC721(nftContract).ownerOf(tokenId) == listing.seller,
            "Seller no longer owns NFT"
        );
        require(
            paymentToken.balanceOf(msg.sender) >= listing.price,
            "Insufficient balance"
        );
        require(
            paymentToken.allowance(msg.sender, address(this)) >= listing.price,
            "Insufficient allowance"
        );

        // Calculate fees and payment
        uint256 feeAmount = (listing.price * feePercentage) / 10000;
        uint256 sellerAmount = listing.price - feeAmount;

        // Transfer payment
        paymentToken.transferFrom(msg.sender, listing.seller, sellerAmount);
        if (feeAmount > 0) {
            paymentToken.transferFrom(msg.sender, feeRecipient, feeAmount);
        }

        // Transfer NFT
        IERC721(nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        // Remove listing
        delete listings[nftContract][tokenId];

        emit ItemBought(msg.sender, nftContract, tokenId, listing.price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the NFT owner"
        );

        delete listings[nftContract][tokenId];
        emit ItemCanceled(msg.sender, nftContract, tokenId);
    }

    // Owner functions
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid address");
        feeRecipient = _feeRecipient;
    }
}
