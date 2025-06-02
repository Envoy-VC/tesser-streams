// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IDiamondCut} from "./interfaces/IDiamondCut.sol";
import {TesserProxyLib} from "./libraries/TesserProxyLib.sol";

/// @title TesserProxy
/// @notice Main proxy contract implementing the Diamond proxy pattern
/// @dev This contract serves as the entry point for all function calls and implements the core proxy functionality
/// using the Diamond proxy pattern. It allows for upgradeable contracts through the addition, removal, and replacement
/// of contract functions (facets).
contract TesserProxy {
    /// @notice Constructor initializes the proxy with an owner and the diamond cut facet
    /// @dev Sets up the initial state of the proxy by:
    /// 1. Setting the contract owner
    /// 2. Adding the diamondCut function from the diamondCutFacet
    /// @param _contractOwner The address that will be set as the contract owner
    /// @param _diamondCutFacet The address of the facet implementing the diamondCut function
    constructor(address _contractOwner, address _diamondCutFacet) payable {
        TesserProxyLib.setContractOwner(_contractOwner);

        // Add the diamondCut external function from the diamondCutFacet
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
        bytes4[] memory functionSelectors = new bytes4[](1);
        functionSelectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: _diamondCutFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: functionSelectors
        });
        TesserProxyLib.diamondCut(cut, address(0), "");
    }

    /// @notice Fallback function that handles all function calls to the proxy
    /// @dev This function:
    /// 1. Retrieves the diamond storage
    /// 2. Looks up the facet address for the called function
    /// 3. Delegates the call to the appropriate facet
    fallback() external payable {
        TesserProxyLib.DiamondStorage storage ds;
        bytes32 position = TesserProxyLib.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
        require(facet != address(0), "TesserProxy: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    /// @notice Receive function that allows the contract to receive ETH
    /// @dev This function is called when the contract receives ETH without any data
    receive() external payable {}
}
