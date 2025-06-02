// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Facets
import {OwnershipFacet} from "./OwnershipFacet.sol";
import {VestingMathFacet} from "./VestingMathFacet.sol";

// Storage
import {VestingStorageLib} from "../libraries/VestingStorage.sol";

contract VestingCoreFacet {
    using SafeERC20 for IERC20;

    event ScheduleCreated(
        bytes32 indexed vestingId, address indexed beneficiary, address token, uint256 totalAmount, uint256 feeAmount
    );

    event TokensReleased(bytes32 indexed vestingId, address beneficiary, uint256 amount);

    modifier onlyOwner() {
        address owner = OwnershipFacet(address(this)).owner();
        require(msg.sender == owner, "Caller not owner");
        _;
    }

    function createVestingSchedule(
        address beneficiary,
        address token,
        uint256 totalAmount,
        uint40 cliffDuration,
        uint40 vestingDuration,
        uint256 alpha
    ) public returns (bytes32 vestingId) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib.vestingStorage();

        // Validate Inputs
        // Validate inputs
        require(beneficiary != address(0), "Zero beneficiary");
        require(token != address(0), "Zero token");
        require(totalAmount > 0, "Zero amount");
        require(vestingDuration > 0, "Zero duration");
        require(VestingStorageLib.isValidAlpha(alpha), "Invalid alpha");

        // Calculate and collect protocol fee
        uint256 feeAmount = (totalAmount * vs.protocolFeeBps) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        // Transfer tokens from sender
        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        // Transfer fee to treasury
        if (feeAmount > 0) {
            IERC20(token).safeTransfer(vs.treasury, feeAmount);
        }

        // Generate unique vesting ID
        vestingId = keccak256(abi.encode(beneficiary, token, block.timestamp, vs.vestingNonce));
        vs.vestingNonce++;

        vs.vestingSchedules[vestingId] = VestingStorageLib.VestingSchedule({
            beneficiary: beneficiary,
            token: token,
            startTime: uint40(block.timestamp),
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            alpha: alpha,
            totalAmount: netAmount,
            released: 0,
            frozen: false
        });

        emit ScheduleCreated(vestingId, beneficiary, token, netAmount, feeAmount);
        return vestingId;
    }

    function release(bytes32 vestingId) public {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib.vestingStorage();
        VestingStorageLib.VestingSchedule storage schedule = vs.vestingSchedules[vestingId];

        // Validate access and state
        require(msg.sender == schedule.beneficiary, "Unauthorized");
        require(!schedule.frozen, "Schedule frozen");
        require(schedule.startTime > 0, "Invalid schedule");

        // Calculate releasable amount
        uint256 releasable = VestingMathFacet(address(this)).computeReleasableAmount(vestingId);
        require(releasable > 0, "Nothing to release");

        // Update state
        schedule.released += releasable;

        // Transfer tokens
        IERC20(schedule.token).safeTransfer(schedule.beneficiary, releasable);

        emit TokensReleased(vestingId, schedule.beneficiary, releasable);
    }

    function getVestingSchedule(bytes32 vestingId) public view returns (VestingStorageLib.VestingSchedule memory) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib.vestingStorage();
        return vs.vestingSchedules[vestingId];
    }
}
