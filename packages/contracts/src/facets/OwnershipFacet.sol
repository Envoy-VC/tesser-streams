// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TesserProxyLib} from "../libraries/TesserProxyLib.sol";
import {IERC173} from "../interfaces/IERC173.sol";

contract OwnershipFacet is IERC173 {
    function transferOwnership(address _newOwner) external override {
        TesserProxyLib.enforceIsContractOwner();
        TesserProxyLib.setContractOwner(_newOwner);
    }

    function owner() external view override returns (address owner_) {
        owner_ = TesserProxyLib.contractOwner();
    }
}
