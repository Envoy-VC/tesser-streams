// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TesserProxyLib} from "../libraries/TesserProxyLib.sol";
import {IERC173} from "../interfaces/IERC173.sol";

/// @title OwnershipFacet
/// @notice Facet implementing the ERC-173 standard for contract ownership
/// @dev This facet provides functionality for managing contract ownership in the diamond proxy pattern
contract OwnershipFacet is IERC173 {
    /// @notice Transfers ownership of the contract to a new owner
    /// @dev This function:
    /// 1. Enforces that the caller is the current contract owner
    /// 2. Updates the contract owner to the new address
    /// @param _newOwner The address of the new contract owner
    function transferOwnership(address _newOwner) external override {
        TesserProxyLib.enforceIsContractOwner();
        TesserProxyLib.setContractOwner(_newOwner);
    }

    /// @notice Returns the current owner of the contract
    /// @return owner_ The address of the current contract owner
    function owner() external view override returns (address owner_) {
        owner_ = TesserProxyLib.contractOwner();
    }
}
