// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TesserProxyLib} from "../libraries/TesserProxyLib.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

/// @title DiamondLoupeFacet
/// @notice Facet implementing the Diamond Loupe interface for inspecting diamond proxy facets
/// @dev This facet provides functionality to inspect the facets and function selectors of a diamond proxy.
/// It is a required component of the EIP-2535 Diamond standard and must be added to any diamond proxy.
contract DiamondLoupeFacet is IDiamondLoupe, IERC165 {
    /// @notice Gets all facets and their function selectors
    /// @dev This function:
    /// 1. Retrieves the diamond storage
    /// 2. Creates an array of Facet structs for all facets
    /// 3. Populates each Facet with its address and function selectors
    /// @return facets_ Array of Facet structs containing all facets and their function selectors
    function facets() public view override returns (Facet[] memory facets_) {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        uint256 numFacets = ds.facetAddresses.length;
        facets_ = new Facet[](numFacets);
        for (uint256 i; i < numFacets; i++) {
            address facetAddress_ = ds.facetAddresses[i];
            facets_[i].facetAddress = facetAddress_;
            facets_[i].functionSelectors = ds.facetFunctionSelectors[facetAddress_].functionSelectors;
        }
    }

    /// @notice Gets all function selectors supported by a specific facet
    /// @dev This function:
    /// 1. Retrieves the diamond storage
    /// 2. Returns the array of function selectors for the specified facet
    /// @param _facet The address of the facet to query
    /// @return facetFunctionSelectors_ Array of function selectors implemented by the facet
    function facetFunctionSelectors(address _facet)
        public
        view
        override
        returns (bytes4[] memory facetFunctionSelectors_)
    {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        facetFunctionSelectors_ = ds.facetFunctionSelectors[_facet].functionSelectors;
    }

    /// @notice Gets all facet addresses used by the diamond proxy
    /// @dev This function:
    /// 1. Retrieves the diamond storage
    /// 2. Returns the array of all facet addresses
    /// @return facetAddresses_ Array of all facet addresses in the diamond proxy
    function facetAddresses() public view override returns (address[] memory facetAddresses_) {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        facetAddresses_ = ds.facetAddresses;
    }

    /// @notice Gets the facet address that implements a specific function selector
    /// @dev This function:
    /// 1. Retrieves the diamond storage
    /// 2. Returns the address of the facet that implements the specified function selector
    /// If no facet implements the selector, returns address(0)
    /// @param _functionSelector The function selector to query
    /// @return facetAddress_ The address of the facet that implements the function selector
    function facetAddress(bytes4 _functionSelector) public view override returns (address facetAddress_) {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        facetAddress_ = ds.selectorToFacetAndPosition[_functionSelector].facetAddress;
    }

    /// @notice Checks if the contract supports a specific interface
    /// @dev This function implements ERC-165 interface detection
    /// @param _interfaceId The interface identifier to check
    /// @return bool True if the interface is supported, false otherwise
    function supportsInterface(bytes4 _interfaceId) public view override returns (bool) {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        return ds.supportedInterfaces[_interfaceId];
    }

    function owner() public view returns (address) {
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        return ds.contractOwner;
    }
}
