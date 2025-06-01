// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {OwnershipStorageLib} from "../libraries/OwnershipStorage.sol";

contract OwnershipFacet {
    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function owner() public view returns (address) {
        return OwnershipStorageLib.ownershipStorage().owner;
    }

    function transferOwnership(address newOwner) external {
        OwnershipStorageLib.OwnershipStorage storage os = OwnershipStorageLib.ownershipStorage();
        require(msg.sender == os.owner, "Only owner");
        require(newOwner != address(0), "Zero address");
        os.pendingOwner = newOwner;
        emit OwnershipTransferStarted(os.owner, newOwner);
    }

    function acceptOwnership() external {
        OwnershipStorageLib.OwnershipStorage storage os = OwnershipStorageLib.ownershipStorage();
        require(msg.sender == os.pendingOwner, "Not pending owner");
        emit OwnershipTransferred(os.owner, os.pendingOwner);
        os.owner = os.pendingOwner;
        os.pendingOwner = address(0);
    }
}
