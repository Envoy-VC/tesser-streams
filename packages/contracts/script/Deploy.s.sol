// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
// Proxy
import {TesserProxy} from "../src/TesserProxy.sol";

// Facets
import {DiamondCutFacet} from "../src/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "../src/facets/DiamondLoupeFacet.sol";
import {OwnershipFacet} from "../src/facets/OwnershipFacet.sol";
import {VestingCoreFacet} from "../src/facets/VestingCoreFacet.sol";
import {VestingMathFacet} from "../src/facets/VestingMathFacet.sol";
import {ERC6551RegistryFacet} from "../src/facets/ERC6551RegistryFacet.sol";

// Token
import {TesserToken} from "../src/TesserToken.sol";

// Initializers
import {TesserInit} from "../src/initializers/TesserInitializer.sol";

// Libraries
import {TesserProxyLib} from "../src/libraries/TesserProxyLib.sol";

// Interfaces
import {IDiamondCut} from "../src/interfaces/IDiamondCut.sol";

// ERC6551
import {Account as ERC6551Account} from "../src/Account.sol";
import {AccountProxy} from "../src/AccountProxy.sol";

// Token
import {FractionalStreamNFT} from "../src/FractionalStreamNFT.sol";

// Marketplace
import {Marketplace} from "../src/Marketplace.sol";

contract DeployScript is Script {
    // Proxy
    TesserProxy public tesserProxy;

    // Facets
    DiamondCutFacet public diamondCutFacet;
    DiamondLoupeFacet public diamondLoupeFacet;
    OwnershipFacet public ownershipFacet;
    VestingCoreFacet public vestingCoreFacet;
    VestingMathFacet public vestingMathFacet;
    ERC6551RegistryFacet public erc6551RegistryFacet;

    // Initializers
    TesserInit public tesserInit;

    // Token
    TesserToken public tesserToken;
    FractionalStreamNFT public fsNFT;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Counter deployer address", deployerAddress);
        DiamondCutFacet _diamondCutFacet = new DiamondCutFacet();
        console.log("Deployed DiamondCutFacet: ", address(_diamondCutFacet));
        // Deploy Ownership Facet
        OwnershipFacet _ownershipFacet = new OwnershipFacet();
        console.log("Deployed OwnershipFacet: ", address(_ownershipFacet));

        // Deploy Proxy
        tesserProxy = new TesserProxy(
            deployerAddress,
            address(_diamondCutFacet),
            address(_ownershipFacet)
        );
        console.log("Deployed TesserProxy: ", address(tesserProxy));

        // Initialize Facets
        initializeFacets(address(tesserProxy), deployerAddress);

        // Set Facets
        diamondCutFacet = DiamondCutFacet(address(tesserProxy));
        diamondLoupeFacet = DiamondLoupeFacet(address(tesserProxy));
        ownershipFacet = OwnershipFacet(address(tesserProxy));
        vestingCoreFacet = VestingCoreFacet(address(tesserProxy));
        vestingMathFacet = VestingMathFacet(address(tesserProxy));
        erc6551RegistryFacet = ERC6551RegistryFacet(address(tesserProxy));

        // Deploy Token
        tesserToken = new TesserToken(deployerAddress);
        console.log("Deployed TesserToken: ", address(tesserToken));

        // Deploy Marketplace
        Marketplace marketplace = new Marketplace(
            deployerAddress,
            address(tesserToken),
            0,
            deployerAddress
        );
        console.log("Deployed Marketplace: ", address(marketplace));

        vm.stopBroadcast();
    }

    function initializeFacets(
        address _tesserProxy,
        address _deployerAddress
    ) internal {
        DiamondCutFacet cut = DiamondCutFacet(_tesserProxy);

        // Deploy Facets
        DiamondLoupeFacet _diamondLoupeFacet = new DiamondLoupeFacet();
        console.log(
            "Deployed DiamondLoupeFacet: ",
            address(_diamondLoupeFacet)
        );
        VestingCoreFacet _vestingCoreFacet = new VestingCoreFacet();
        console.log("Deployed VestingCoreFacet: ", address(_vestingCoreFacet));
        VestingMathFacet _vestingMathFacet = new VestingMathFacet();
        console.log("Deployed VestingMathFacet: ", address(_vestingMathFacet));
        ERC6551RegistryFacet _erc6551RegistryFacet = new ERC6551RegistryFacet();
        console.log(
            "Deployed ERC6551RegistryFacet: ",
            address(_erc6551RegistryFacet)
        );

        // Prepare diamond cut data
        IDiamondCut.FacetCut[] memory facetCuts = new IDiamondCut.FacetCut[](4);

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
        bytes4[] memory vestingCoreSelectors = new bytes4[](4);
        vestingCoreSelectors[0] = VestingCoreFacet
            .createVestingSchedule
            .selector;
        vestingCoreSelectors[1] = VestingCoreFacet.release.selector;
        vestingCoreSelectors[2] = VestingCoreFacet.getVestingSchedule.selector;
        vestingCoreSelectors[3] = VestingCoreFacet
            .getBeneficiaryForVestingId
            .selector;
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

        // ERC6551 Registry Facet
        bytes4[] memory erc6551RegistrySelectors = new bytes4[](2);
        erc6551RegistrySelectors[0] = ERC6551RegistryFacet
            .createAccount
            .selector;
        erc6551RegistrySelectors[1] = ERC6551RegistryFacet.account.selector;
        facetCuts[3] = IDiamondCut.FacetCut({
            facetAddress: address(_erc6551RegistryFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: erc6551RegistrySelectors
        });

        // Deploy Initializer
        tesserInit = new TesserInit();
        console.log("Deployed TesserInit: ", address(tesserInit));

        // Deploy Implementation Contract
        ERC6551Account implementation = new ERC6551Account();
        console.log("Deployed Implementation: ", address(implementation));

        // Deploy FractionalStreamNFT
        fsNFT = new FractionalStreamNFT(_deployerAddress, address(tesserProxy));
        console.log("Deployed FractionalStreamNFT: ", address(fsNFT));

        // Add Facet Cuts with Initializer
        cut.diamondCut(
            facetCuts,
            address(tesserInit),
            abi.encodeWithSelector(
                TesserInit.init.selector,
                _deployerAddress,
                10,
                address(implementation),
                address(fsNFT)
            ) // 0.1% protocol fee
        );
    }
}
