// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {IERC6551Account} from "./interfaces/IERC6551Account.sol";
import {IERC6551Executable} from "./interfaces/IERC6551Executable.sol";

contract Account is IERC165, IERC1271, IERC6551Account, IERC6551Executable {
    bytes32 constant STATE_SLOT =
        keccak256("tesser.streams.erc6551.account.state");

    struct AccountState {
        uint256 chainId;
        address tokenContract;
        uint256 tokenId;
        uint256 nonce;
    }

    function state()
        external
        view
        override
        returns (uint256, address, uint256, uint256)
    {
        return _getState();
    }

    function _getAccountState()
        internal
        pure
        returns (AccountState storage accountState)
    {
        bytes32 position = STATE_SLOT;
        assembly {
            accountState.slot := position
        }
    }

    function execute(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation
    ) external payable virtual returns (bytes memory result) {
        require(_isValidSigner(msg.sender), "Invalid signer");
        require(operation == 0, "Only call operations are supported");

        // Increment nonce
        AccountState storage accountState = _getAccountState();
        accountState.nonce++;

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }

        return result;
    }

    function isValidSigner(
        address signer,
        bytes calldata
    ) external view virtual returns (bytes4) {
        if (_isValidSigner(signer)) {
            return IERC6551Account.isValidSigner.selector;
        }

        return bytes4(0);
    }

    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view virtual returns (bytes4 magicValue) {
        bool isValid = SignatureChecker.isValidSignatureNow(
            owner(),
            hash,
            signature
        );

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return bytes4(0);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IERC6551Executable).interfaceId;
    }

    function token() public view virtual returns (uint256, address, uint256) {
        AccountState storage accountState = _getAccountState();
        return (
            accountState.chainId,
            accountState.tokenContract,
            accountState.tokenId
        );
    }

    function owner() public view virtual returns (address) {
        AccountState storage accountState = _getAccountState();

        if (accountState.chainId != block.chainid) return address(0);

        return
            IERC721(accountState.tokenContract).ownerOf(accountState.tokenId);
    }

    function _isValidSigner(
        address signer
    ) internal view virtual returns (bool) {
        return signer == owner();
    }

    function _getState()
        internal
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
