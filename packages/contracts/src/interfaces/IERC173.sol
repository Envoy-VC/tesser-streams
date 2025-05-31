// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IERC173
/// @notice Interface for the ERC-173 standard for contract ownership
/// @dev This interface defines the standard functions for managing contract ownership
interface IERC173 {
    /// Emitted when ownership of a contract is transferred
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Returns the address of the current owner
    /// @return owner The address of the current owner
    function owner() external view returns (address owner);

    /// @notice Transfers ownership of the contract to a new owner
    /// @dev This function can only be called by the current owner
    /// @param _newOwner The address of the new owner
    function transferOwnership(address _newOwner) external;
}
