// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalStreamNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    address public tesserProxy;

    constructor(
        address initialOwner,
        address _tesserProxy
    ) ERC721("Fractional Stream NFT", "fsNFT") Ownable(initialOwner) {
        tesserProxy = _tesserProxy;
    }

    modifier onlyTesserProxy() {
        require(
            msg.sender == tesserProxy,
            "FractionalStreamNFT: Only TesserProxy"
        );
        _;
    }

    function safeMint(address to) public onlyTesserProxy returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function getTesserProxy() public view returns (address) {
        return tesserProxy;
    }

    function setTesserProxy(address _tesserProxy) public onlyOwner {
        require(
            _tesserProxy != address(0),
            "FractionalStreamNFT: Zero address"
        );
        tesserProxy = _tesserProxy;
    }
}
