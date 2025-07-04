// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Facets
import {OwnershipFacet} from "./OwnershipFacet.sol";
import {VestingMathFacet} from "./VestingMathFacet.sol";

// Token
import {FractionalStreamNFT} from "../FractionalStreamNFT.sol";

// Storage
import {VestingStorageLib} from "../libraries/VestingStorage.sol";

// Registry Facet
import {ERC6551RegistryFacet} from "./ERC6551RegistryFacet.sol";

contract VestingCoreFacet {
    using SafeERC20 for IERC20;

    event ScheduleCreated(
        bytes32 indexed vestingId,
        address indexed beneficiary,
        address token,
        uint256 totalAmount,
        uint256 feeAmount,
        address accountAddress,
        uint256 tokenId
    );

    event TokensReleased(
        bytes32 indexed vestingId,
        address beneficiary,
        uint256 amount
    );

    modifier onlyOwner() {
        address owner = OwnershipFacet(address(this)).owner();
        require(msg.sender == owner, "Caller not owner");
        _;
    }

    function createVestingSchedule(
        address beneficiary,
        address tokenAddress,
        uint256 totalAmount,
        uint40 cliffDuration,
        uint40 vestingDuration,
        uint256 alpha
    ) public returns (bytes32 vestingId) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib
            .vestingStorage();

        // Validate Inputs
        require(beneficiary != address(0), "Zero beneficiary");
        require(tokenAddress != address(0), "Zero token");
        require(totalAmount > 0, "Zero amount");
        require(vestingDuration > 0, "Zero duration");
        require(VestingStorageLib.isValidAlpha(alpha), "Invalid alpha");

        IERC20 token = IERC20(tokenAddress);

        FractionalStreamNFT fsNFT = FractionalStreamNFT(vs.fractionalStreamNFT);
        uint256 tokenId = fsNFT.safeMint(beneficiary);

        // TODO: Step 2: Deploy ERC6551Account with that token
        ERC6551RegistryFacet erc6551Registry = ERC6551RegistryFacet(
            address(this)
        );
        address accountAddress = erc6551Registry.createAccount(
            vs.accountImplementation,
            block.chainid,
            vs.fractionalStreamNFT,
            tokenId
        );

        // Calculate and collect protocol fee
        uint256 feeAmount = (totalAmount * vs.protocolFeeBps) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        // Transfer tokens from sender
        token.safeTransferFrom(msg.sender, address(this), totalAmount);

        // Transfer fee to treasury
        if (feeAmount > 0) {
            token.safeTransfer(vs.treasury, feeAmount);
        }

        address tkAddr = tokenAddress;

        // Generate unique vesting ID
        vestingId = keccak256(
            abi.encode(
                tkAddr,
                totalAmount,
                cliffDuration,
                vestingDuration,
                alpha,
                vs.vestingNonce,
                tokenId
            )
        );
        vs.vestingNonce++;

        vs.vestingSchedules[vestingId] = VestingStorageLib.VestingSchedule({
            tokenAddress: tkAddr,
            startTime: uint40(block.timestamp),
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            alpha: alpha,
            totalAmount: netAmount,
            released: 0,
            frozen: false,
            accountAddress: accountAddress,
            tokenId: tokenId
        });

        emit ScheduleCreated(
            vestingId,
            beneficiary,
            tkAddr,
            netAmount,
            feeAmount,
            accountAddress,
            tokenId
        );
        return vestingId;
    }

    function getBeneficiaryForVestingId(
        bytes32 vestingId
    ) public view returns (address) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib
            .vestingStorage();
        VestingStorageLib.VestingSchedule memory schedule = vs.vestingSchedules[
            vestingId
        ];

        address owner = FractionalStreamNFT(vs.fractionalStreamNFT).ownerOf(
            schedule.tokenId
        );

        return owner;
    }

    function release(bytes32 vestingId) public {
        VestingStorageLib.VestingSchedule storage schedule = VestingStorageLib
            .vestingStorage()
            .vestingSchedules[vestingId];

        // Validate access and state
        address beneficiary = getBeneficiaryForVestingId(vestingId);
        require(msg.sender == beneficiary, "Not a beneficiary");
        require(!schedule.frozen, "Schedule frozen");
        require(schedule.startTime > 0, "Invalid schedule");

        // Calculate releasable amount
        uint256 releasable = VestingMathFacet(address(this))
            .computeReleasableAmount(vestingId);
        require(releasable > 0, "Nothing to release");

        // Update state
        schedule.released += releasable;

        // Transfer tokens
        IERC20(schedule.tokenAddress).safeTransfer(beneficiary, releasable);
        emit TokensReleased(vestingId, beneficiary, releasable);
    }

    function getVestingSchedule(
        bytes32 vestingId
    ) public view returns (VestingStorageLib.VestingSchedule memory) {
        VestingStorageLib.VestingStorage storage vs = VestingStorageLib
            .vestingStorage();
        return vs.vestingSchedules[vestingId];
    }
}
