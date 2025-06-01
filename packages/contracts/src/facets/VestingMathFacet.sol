// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {VestingStorageLib} from "../libraries/VestingStorage.sol";
import {UD60x18, ud, intoUint256} from "prb-math/UD60x18.sol";

contract VestingMathFacet {
    function computeVestedAmount(bytes32 vestingId) public view returns (uint256) {
        return _computeVestedAmount(vestingId, block.timestamp);
    }

    function computeReleasableAmount(bytes32 vestingId) public view returns (uint256) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib.vestingStorage();
        VestingStorageLib.VestingSchedule storage schedule = vs.vestingSchedules[vestingId];

        if (schedule.frozen) return 0;

        uint256 vested = _computeVestedAmount(vestingId, block.timestamp);
        return vested > schedule.released ? vested - schedule.released : 0;
    }

    function _computeVestedAmount(bytes32 vestingId, uint256 timestamp) internal view returns (uint256) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib.vestingStorage();
        VestingStorageLib.VestingSchedule storage schedule = vs.vestingSchedules[vestingId];

        if (schedule.frozen) return schedule.released;
        if (timestamp < schedule.startTime + schedule.cliffDuration) return 0;

        uint256 vestingEnd = schedule.startTime + schedule.cliffDuration + schedule.vestingDuration;

        if (timestamp >= vestingEnd) return schedule.totalAmount;

        uint256 elapsed = timestamp - (schedule.startTime + schedule.cliffDuration);
        UD60x18 ratio = ud((elapsed * VestingStorageLib.PRECISION) / schedule.vestingDuration);
        UD60x18 alpha = ud(schedule.alpha);
        UD60x18 ratioAlpha = ratio.pow(alpha);

        uint256 ratioAlphaUint = intoUint256(ratioAlpha);

        return (schedule.totalAmount * ratioAlphaUint) / VestingStorageLib.PRECISION;
    }
}
