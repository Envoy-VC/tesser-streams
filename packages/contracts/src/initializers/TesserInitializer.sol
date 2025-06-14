// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TesserProxyLib} from "../libraries/TesserProxyLib.sol";

// Interfaces
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {IERC173} from "../interfaces/IERC173.sol";
import {IERC6551Registry} from "../interfaces/IERC6551Registry.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

// Storage
import {OwnershipStorageLib} from "../libraries/OwnershipStorage.sol";
import {VestingStorageLib} from "../libraries/VestingStorage.sol";
import {ERC6551RegistryStorageLib} from "../libraries/ERC6551RegistryStorage.sol";

/// @title TesserInit
/// @notice Initialization contract for the Tesser Diamond proxy
/// @dev This contract is responsible for initializing the diamond proxy with required interfaces
/// and any custom state variables. It is called during the diamond deployment or upgrade process
/// through the diamondCut function.
contract TesserInit {
    /// @notice Initializes the diamond proxy with required interfaces and state variables
    /// @param _treasury The address of the treasury
    /// @param _protocolFeeBps The protocol fee in basis points
    /// @param _initialImplementation The address of the initial implementation contract
    /// @param _fractionalStreamNFT The address of the FractionalStreamNFT contract
    function init(
        address _treasury,
        uint16 _protocolFeeBps,
        address _initialImplementation,
        address _fractionalStreamNFT
    ) public {
        // adding ERC165 data
        TesserProxyLib.DiamondStorage storage ds = TesserProxyLib
            .diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IERC6551Registry).interfaceId] = true;

        VestingStorageLib.initVesting(
            _treasury,
            _protocolFeeBps,
            _fractionalStreamNFT,
            _initialImplementation
        );
        ERC6551RegistryStorageLib.initERC6551Registry(_initialImplementation);
    }
}
