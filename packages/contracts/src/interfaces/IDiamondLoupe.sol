// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Diamond Loupe Interface
/// @notice This interface provides functions to inspect the facets and function selectors of a diamond proxy
/// @dev The Diamond Loupe is a standard interface for inspecting the facets and function selectors of a diamond proxy
interface IDiamondLoupe {
    /// @notice A struct representing a facet and its function selectors
    /// @param facetAddress The address of the facet contract
    /// @param functionSelectors The array of function selectors implemented by the facet
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    /// @notice Gets all facets and their function selectors
    /// @return facets An array of Facet structs containing all facets and their function selectors
    function facets() external view returns (Facet[] memory facets);

    /// @notice Gets all function selectors supported by a specific facet
    /// @param _facet The address of the facet to query
    /// @return facetFunctionSelectors An array of function selectors implemented by the facet
    function facetFunctionSelectors(address _facet) external view returns (bytes4[] memory facetFunctionSelectors);

    /// @notice Gets all facet addresses used by the diamond proxy
    /// @return facetAddresses An array of all facet addresses
    function facetAddresses() external view returns (address[] memory facetAddresses);

    /// @notice Gets the facet address that implements a specific function selector
    /// @param _functionSelector The function selector to query
    /// @return facetAddress The address of the facet that implements the function selector
    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress);
}
