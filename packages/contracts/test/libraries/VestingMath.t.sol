// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {UD60x18, ud, intoUint256} from "@prb/math/src/UD60x18.sol";

contract VestingMathTest is Test {
    function test_computeRatio() public pure {
        // Compute x^a (0.1^0.37)
        UD60x18 x = ud(0.5e18);
        UD60x18 a = ud(0.5e18);
        // Without Approximation: 707106781186547600
        // With Approximation:    707106781186547524
        uint256 ratio = intoUint256(x.pow(a));

        assertEq(ratio, 707106781186547524);
    }
}
