// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccountProxy} from "../AccountProxy.sol";

// Libraries
import {OwnershipStorageLib} from "../libraries/OwnershipStorage.sol";
import {ERC6551RegistryStorageLib} from "../libraries/ERC6551RegistryStorage.sol";

// Interfaces
import {IERC6551Registry} from "../interfaces/IERC6551Registry.sol";

contract ERC6551RegistryFacet is IERC6551Registry {
    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address) {
        ERC6551RegistryStorageLib.ERC6551Storage
            storage es = ERC6551RegistryStorageLib.erc6551Storage();

        // Validate implementation
        if (implementation == address(0)) revert InvalidImplementation();
        if (es.implementation != implementation) revert InvalidImplementation();

        bytes32 accountSalt = keccak256(abi.encode(tokenId));

        // Check if account already exists
        if (es.accountDeployed[accountSalt]) revert AccountAlreadyExists();

        // Deploy new account contract
        address accountAddress = address(
            new AccountProxy(implementation, chainId, tokenContract, tokenId)
        );

        // Verify deployment success
        if (accountAddress.code.length == 0) revert AccountCreationFailed();

        // Update storage
        es.accountCache[accountSalt] = accountAddress;
        es.accountDeployed[accountSalt] = true;

        emit ERC6551AccountCreated(
            accountAddress,
            implementation,
            accountSalt,
            chainId,
            tokenContract,
            tokenId
        );

        return accountAddress;
    }

    function account(uint256 tokenId) external view returns (address) {
        ERC6551RegistryStorageLib.ERC6551Storage
            storage es = ERC6551RegistryStorageLib.erc6551Storage();
        bytes32 accountSalt = keccak256(abi.encode(tokenId));
        return es.accountCache[accountSalt];
    }
}
