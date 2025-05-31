// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IDiamondCut
/// @notice Interface for the Diamond Cut proxy pattern
/// @dev This interface defines the core functionality for modifying a diamond proxy's facets
interface IDiamondCut {
    /// @notice Enum representing the possible actions that can be performed on a facet
    /// @dev Used in FacetCut struct to specify the type of modification
    enum FacetCutAction {
        Add,
        Replace,
        Remove
    }

    /// Struct representing a single facet modification which contains all necessary information to perform a facet cut operation
    struct FacetCut {
        // The address of the facet contract
        address facetAddress;
        // The action to perform on the facet
        FacetCutAction action;
        // Array of function selectors to be affected by this cut
        bytes4[] functionSelectors;
    }

    /// @notice Performs a diamond cut operation to modify the proxy's facets
    /// @dev This function allows adding, replacing, or removing facets and their functions
    /// @param _diamondCut Array of FacetCut structs containing the modifications to perform
    /// @param _init Address of the initialization contract (if any)
    /// @param _calldata Calldata to be passed to the initialization contract
    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external;

    /// @notice Emitted when a diamond cut operation is performed
    /// @param _diamondCut Array of FacetCut structs that were applied
    /// @param _init Address of the initialization contract that was called
    /// @param _calldata Calldata that was passed to the initialization contract
    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);
}
