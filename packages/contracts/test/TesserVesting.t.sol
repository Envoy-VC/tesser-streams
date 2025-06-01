// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

import {SetUp} from "test/base/SetUp.sol";

// Libraries
import {TesserProxyLib} from "src/libraries/TesserProxyLib.sol";

// Interfaces
import {IDiamondLoupe} from "src/interfaces/IDiamondLoupe.sol";

contract TesserVestingTests is Test, SetUp {
    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public virtual override {
        super.setUp();
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");
    }

    function getReleasableAmount(bytes32 vestingId) public view returns (uint256) {
        return vestingMathFacet.computeReleasableAmount(vestingId) / 1e18;
    }

    function getVestedAmount(bytes32 vestingId) public view returns (uint256) {
        return vestingMathFacet.computeVestedAmount(vestingId) / 1e18;
    }

    struct TimeSlots {
        uint256 timestamp;
        uint256 vestedAmount;
        uint256 releasableAmount;
    }

    function test_createVestingSchedule() public {
        vm.startBroadcast(alice.addr);
        uint256 totalAmount = 1000e18;
        uint40 cliffDuration = 3 days;
        uint40 vestingDuration = 30 days;
        uint256 alpha = 0.5e18;

        tesserToken.mint(alice.addr, totalAmount);
        tesserToken.approve(address(vestingCoreFacet), totalAmount);

        bytes32 vestingId = vestingCoreFacet.createVestingSchedule(
            bob.addr, address(tesserToken), totalAmount, cliffDuration, vestingDuration, alpha
        );

        uint256 length = (vestingDuration + cliffDuration) / 1 days;

        TimeSlots[] memory timeSlots = new TimeSlots[](length);

        for (uint256 i = 0; i < length; i++) {
            vm.warp(block.timestamp + 1 days);
            timeSlots[i].timestamp = block.timestamp + i * 1 days;
            timeSlots[i].vestedAmount = getVestedAmount(vestingId);
            timeSlots[i].releasableAmount = getReleasableAmount(vestingId);
        }

        for (uint256 i = 0; i < length; i++) {
            console.log(i, timeSlots[i].releasableAmount);
        }
    }
}
