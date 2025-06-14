// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {OwnershipStorageLib} from "./OwnershipStorage.sol";

library ERC6551RegistryStorageLib {
    bytes32 constant ERC6551_STORAGE_POSITION =
        keccak256("tesser.streams.erc6551.storage");

    error AlreadyInitializedRegistry();

    struct ERC6551Storage {
        address implementation;
        mapping(bytes32 => address) accountCache;
        mapping(bytes32 => bool) accountDeployed;
    }

    function erc6551Storage()
        internal
        pure
        returns (ERC6551Storage storage es)
    {
        bytes32 position = ERC6551_STORAGE_POSITION;
        assembly {
            es.slot := position
        }
    }

    function initERC6551Registry(address initialImplementation) internal {
        ERC6551Storage storage es = erc6551Storage();
        if (es.implementation != address(0)) {
            revert AlreadyInitializedRegistry();
        }
        es.implementation = initialImplementation;
    }

    function setImplementation(address _implementation) internal {
        OwnershipStorageLib.enforceContractOwner();
        ERC6551Storage storage es = erc6551Storage();
        es.implementation = _implementation;
    }

    function getImplementation() internal view returns (address) {
        ERC6551Storage storage es = erc6551Storage();
        return es.implementation;
    }
}
