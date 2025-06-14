// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AccountProxy {
    // Storage slots
    bytes32 constant IMPLEMENTATION_SLOT =
        keccak256("tesser.streams.erc6551.account.implementation");
    bytes32 constant STATE_SLOT =
        keccak256("tesser.streams.erc6551.account.state");

    struct AccountState {
        uint256 chainId;
        address tokenContract;
        uint256 tokenId;
        uint256 nonce;
    }

    constructor(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) {
        // Store implementation address
        bytes32 implementationSlot = IMPLEMENTATION_SLOT;
        assembly {
            sstore(implementationSlot, implementation)
        }

        // Store account state
        bytes32 stateSlot = STATE_SLOT;
        AccountState memory accountState = AccountState({
            chainId: chainId,
            tokenContract: tokenContract,
            tokenId: tokenId,
            nonce: 0
        });
        assembly {
            sstore(stateSlot, accountState)
        }
    }

    fallback() external payable {
        bytes32 implementationSlot = IMPLEMENTATION_SLOT;
        address implementation;
        assembly {
            implementation := sload(implementationSlot)
        }

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function state()
        external
        view
        returns (uint256, address, uint256, uint256)
    {
        bytes32 stateSlot = STATE_SLOT;
        AccountState memory accountState;
        assembly {
            accountState := sload(stateSlot)
        }
        return (
            accountState.chainId,
            accountState.tokenContract,
            accountState.tokenId,
            accountState.nonce
        );
    }

    receive() external payable {}
}
