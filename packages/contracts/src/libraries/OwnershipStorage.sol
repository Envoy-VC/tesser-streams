// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library OwnershipStorageLib {
    bytes32 constant OWNERSHIP_STORAGE_POSITION =
        keccak256("tesser.streams.ownership.storage");

    error AlreadyInitialized();

    struct OwnershipStorage {
        address owner;
        address pendingOwner;
    }

    function ownershipStorage()
        internal
        pure
        returns (OwnershipStorage storage os)
    {
        bytes32 position = OWNERSHIP_STORAGE_POSITION;
        assembly {
            os.slot := position
        }
    }

    function initOwnership(address initialOwner) internal {
        OwnershipStorage storage os = ownershipStorage();
        if (os.owner != address(0)) {
            revert AlreadyInitialized();
        }
        os.owner = initialOwner;
    }

    function enforceContractOwner() internal view {
        OwnershipStorage storage os = ownershipStorage();
        require(
            msg.sender == os.owner,
            "OwnershipStorage: Must be contract owner"
        );
    }

    function transferOwnership(address newOwner) public {
        OwnershipStorage storage os = ownershipStorage();
        require(
            msg.sender == os.owner,
            "OwnershipStorage: Must be contract owner"
        );
        os.pendingOwner = newOwner;
    }

    function acceptOwnership() public {
        OwnershipStorage storage os = ownershipStorage();
        require(
            msg.sender == os.pendingOwner,
            "OwnershipStorage: Must be pending owner"
        );
        os.owner = os.pendingOwner;
        os.pendingOwner = address(0);
    }
}
