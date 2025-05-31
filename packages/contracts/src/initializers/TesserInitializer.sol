// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TesserProxyLib} from "../libraries/TesserProxyLib.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {IERC173} from "../interfaces/IERC173.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

/// @title TesserInit
/// @notice Initialization contract for the Tesser Diamond proxy
/// @dev This contract is responsible for initializing the diamond proxy with required interfaces
/// and any custom state variables. It is called during the diamond deployment or upgrade process
/// through the diamondCut function.
contract TesserInit {
    /// @notice Initializes the diamond proxy with required interfaces and state variables
    function init() external {
        // adding ERC165 data
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;

        // add your own state variables
        // EIP-2535 specifies that the `diamondCut` function takes two optional
        // arguments: address _init and bytes calldata _calldata
        // These arguments are used to execute an arbitrary function using delegatecall
        // in order to set state variables in the diamond during deployment or an upgrade
        // More info here: https://eips.ethereum.org/EIPS/eip-2535#diamond-interface
    }
}
