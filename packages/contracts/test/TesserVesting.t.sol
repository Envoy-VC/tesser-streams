// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

import {SetUp} from "test/base/SetUp.sol";

// Libraries
import {TesserProxyLib} from "src/libraries/TesserProxyLib.sol";
import {VestingStorageLib} from "src/libraries/VestingStorage.sol";

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
        uint40 cliffDuration = 30 days;
        uint40 vestingDuration = 365 days;
        uint256 alpha = 0.5e18;

        tesserToken.mint(alice.addr, totalAmount);
        tesserToken.approve(address(vestingCoreFacet), totalAmount);

        bytes32 vestingId = vestingCoreFacet.createVestingSchedule(
            bob.addr, address(tesserToken), totalAmount, cliffDuration, vestingDuration, alpha
        );

        uint256 vestedAmount = getVestedAmount(vestingId);
        uint256 releasableAmount = getReleasableAmount(vestingId);
        assertEq(vestedAmount, 0);
        assertEq(releasableAmount, 0);

        // After Cliff duration vested, releasable amount should be equal 0
        vm.warp(block.timestamp + cliffDuration);
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        // After Half vesting duration, vested amount should be equal to (0.5)^alpha * totalAmount
        // that is (0.5)^0.5 * 950 = 671
        /// 950 because of 5% protocol fee
        VestingStorageLib.VestingSchedule memory schedule = vestingCoreFacet.getVestingSchedule(vestingId);
        vm.warp(block.timestamp + vestingDuration / 2 + schedule.startTime);
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        assertEq(vestedAmount, 671);
        assertEq(releasableAmount, 671);

        vm.stopBroadcast();

        // Now we release tokens
        vm.startBroadcast(bob.addr);
        uint256 bobBalance = tesserToken.balanceOf(bob.addr);
        vestingCoreFacet.release(vestingId);
        bobBalance = tesserToken.balanceOf(bob.addr) / 1e18;
        assertEq(bobBalance, 671);
        vm.stopBroadcast();

        // After releasing tokens vested amount should be equal 671 but releasable amount should be 0
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        assertEq(vestedAmount, 671);
        assertEq(releasableAmount, 0);

        // After more 1/4 of vesting duration, vested amount should be equal to (0.75)^0.5 * totalAmount
        // that is (0.75)^0.5 * 950 = 822
        // Vested amount should be 822 but releasable amount should be 822 - 671 = 150 (approximation)

        vm.warp(block.timestamp + vestingDuration / 4);
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        assertEq(vestedAmount, 822);
        assertEq(releasableAmount, 150);

        // after more 1/4 of vesting duration, releasable amount should be 950 - 671 = 278(approximation)
        vm.warp(block.timestamp + vestingDuration / 4);
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        assertEq(vestedAmount, 950);
        assertEq(releasableAmount, 278);

        // Claim all releasable amount
        vm.startBroadcast(bob.addr);
        vestingCoreFacet.release(vestingId);
        bobBalance = tesserToken.balanceOf(bob.addr);
        vm.stopBroadcast();

        assertEq(bobBalance, 950e18);

        // After releasing all tokens, vested amount should be equal to total amount
        vestedAmount = getVestedAmount(vestingId);
        releasableAmount = getReleasableAmount(vestingId);

        assertEq(vestedAmount, 950);
        assertEq(releasableAmount, 0);
    }
}
