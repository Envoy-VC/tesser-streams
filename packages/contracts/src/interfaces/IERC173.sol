// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IERC173 {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function owner() external view returns (address owner);

    function transferOwnership(address _newOwner) external;
}
