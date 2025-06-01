// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library VestingStorageLib {
    bytes32 constant VESTING_STORAGE_POSITION = keccak256("tesser.streams.vesting.storage");

    uint256 constant PRECISION = 1e18;
    uint256 constant MIN_ALPHA = 1 * PRECISION / 10; // 0.1
    uint256 constant MAX_ALPHA = 9 * PRECISION / 10; // 0.9

    error InvalidAlpha();
    error AlreadyInitialized();

    struct VestingSchedule {
        address beneficiary;
        address token;
        uint40 startTime;
        uint40 cliffDuration;
        uint40 vestingDuration;
        uint256 alpha;
        uint256 totalAmount;
        uint256 released;
        bool frozen;
    }

    struct VestingStorage {
        address treasury;
        uint16 protocolFeeBps;
        uint256 vestingNonce;
        mapping(bytes32 => VestingSchedule) vestingSchedules;
    }

    function vestingStorage() internal pure returns (VestingStorage storage vs) {
        bytes32 position = VESTING_STORAGE_POSITION;
        assembly {
            vs.slot := position
        }
    }

    function initVesting(address treasury, uint16 protocolFeeBps) internal {
        VestingStorage storage vs = vestingStorage();
        if (vs.treasury != address(0)) {
            revert AlreadyInitialized();
        }
        vs.treasury = treasury;
        vs.protocolFeeBps = protocolFeeBps;
    }

    function validateAlpha(uint256 alpha) internal pure {
        if (!isValidAlpha(alpha)) {
            revert InvalidAlpha();
        }
    }

    function isValidAlpha(uint256 alpha) internal pure returns (bool) {
        return alpha >= MIN_ALPHA && alpha <= MAX_ALPHA;
    }
}
