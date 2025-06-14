// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

// Proxy
import {TesserProxy} from "../../src/TesserProxy.sol";

// Facets
import {DiamondCutFacet} from "../../src/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "../../src/facets/DiamondLoupeFacet.sol";
import {OwnershipFacet} from "../../src/facets/OwnershipFacet.sol";
import {VestingCoreFacet} from "../../src/facets/VestingCoreFacet.sol";
import {VestingMathFacet} from "../../src/facets/VestingMathFacet.sol";

// Token
import {TesserToken} from "../../src/TesserToken.sol";

// Initializers
import {TesserInit} from "../../src/initializers/TesserInitializer.sol";

// Libraries
import {TesserProxyLib} from "../../src/libraries/TesserProxyLib.sol";

// Interfaces
import {IDiamondCut} from "../../src/interfaces/IDiamondCut.sol";

contract SetUp is Test {
    Vm.Wallet public owner;

    // Proxy
    TesserProxy public tesserProxy;

    // Facets
    DiamondCutFacet public diamondCutFacet;
    DiamondLoupeFacet public diamondLoupeFacet;
    OwnershipFacet public ownershipFacet;
    VestingCoreFacet public vestingCoreFacet;
    VestingMathFacet public vestingMathFacet;

    // Initializers
    TesserInit public tesserInit;

    // Token
    TesserToken public tesserToken;

    bool public __setUpDone;

    function testDeployTesser() public {
        // Prevents being counted in Foundry Coverage
    }

    function setUp() public virtual {
        if (__setUpDone) {
            return;
        }
        owner = vm.createWallet("owner");
        vm.startBroadcast(owner.addr);

        // Deploy Diamond Cut Facet
        DiamondCutFacet _diamondCutFacet = new DiamondCutFacet();
        // Deploy Ownership Facet
        OwnershipFacet _ownershipFacet = new OwnershipFacet();

        // Deploy Proxy
        tesserProxy = new TesserProxy(
            owner.addr,
            address(_diamondCutFacet),
            address(_ownershipFacet)
        );

        // Initialize Facets
        initializeFacets(address(tesserProxy));

        // Set Facets
        diamondCutFacet = DiamondCutFacet(address(tesserProxy));
        diamondLoupeFacet = DiamondLoupeFacet(address(tesserProxy));
        ownershipFacet = OwnershipFacet(address(tesserProxy));
        vestingCoreFacet = VestingCoreFacet(address(tesserProxy));
        vestingMathFacet = VestingMathFacet(address(tesserProxy));

        // Deploy Token
        tesserToken = new TesserToken(owner.addr);

        vm.stopBroadcast();

        __setUpDone = true;
    }

    function initializeFacets(address _tesserProxy) internal {
        DiamondCutFacet cut = DiamondCutFacet(_tesserProxy);

        // Deploy Facets
        DiamondLoupeFacet _diamondLoupeFacet = new DiamondLoupeFacet();
        VestingCoreFacet _vestingCoreFacet = new VestingCoreFacet();
        VestingMathFacet _vestingMathFacet = new VestingMathFacet();

        // Prepare diamond cut data
        IDiamondCut.FacetCut[] memory facetCuts = new IDiamondCut.FacetCut[](3);

        // Diamond Loupe Facet
        bytes4[] memory diamondLoupeSelectors = new bytes4[](6);
        diamondLoupeSelectors[0] = DiamondLoupeFacet.facets.selector;
        diamondLoupeSelectors[1] = DiamondLoupeFacet
            .facetFunctionSelectors
            .selector;
        diamondLoupeSelectors[2] = DiamondLoupeFacet.facetAddresses.selector;
        diamondLoupeSelectors[3] = DiamondLoupeFacet.facetAddress.selector;
        diamondLoupeSelectors[4] = DiamondLoupeFacet.supportsInterface.selector;
        facetCuts[0] = IDiamondCut.FacetCut({
            facetAddress: address(_diamondLoupeFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: diamondLoupeSelectors
        });

        // Vesting Core Facet
        bytes4[] memory vestingCoreSelectors = new bytes4[](3);
        vestingCoreSelectors[0] = VestingCoreFacet
            .createVestingSchedule
            .selector;
        vestingCoreSelectors[1] = VestingCoreFacet.release.selector;
        vestingCoreSelectors[2] = VestingCoreFacet.getVestingSchedule.selector;
        facetCuts[1] = IDiamondCut.FacetCut({
            facetAddress: address(_vestingCoreFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: vestingCoreSelectors
        });

        // Vesting Math Facet
        bytes4[] memory vestingMathSelectors = new bytes4[](2);
        vestingMathSelectors[0] = VestingMathFacet.computeVestedAmount.selector;
        vestingMathSelectors[1] = VestingMathFacet
            .computeReleasableAmount
            .selector;
        facetCuts[2] = IDiamondCut.FacetCut({
            facetAddress: address(_vestingMathFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: vestingMathSelectors
        });

        // Deploy Initializer
        tesserInit = new TesserInit();

        // Add Facet Cuts with Initializer
        cut.diamondCut(
            facetCuts,
            address(tesserInit),
            abi.encodeWithSelector(TesserInit.init.selector, owner.addr, 500) // 5% protocol fee
        );
    }
}
