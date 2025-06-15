import {
  FRACTIONAL_NFT_ABI,
  MARKETPLACE_ABI,
  TESSER_TOKEN_ABI,
  VESTING_CORE_ABI,
  VESTING_MATH_ABI,
} from '~/abi';

// Ethereum Sepolia
// Deploying Counter deployer address 0x9A36a8EDAF9605F7D4dDC72F4D81463fb6f841d8
// Deployed DiamondCutFacet:  0x72c290C55E5C836dbB05ff7cA3948AB2AaFb8917
// Deployed OwnershipFacet:  0x23fb3A2CAe9dC42111B1430a1A091c8a7111903b
// Deployed TesserProxy:  0x75436f3D74CcAcB1Fa507B827420B08Fb571D9bc
// Deployed DiamondLoupeFacet:  0xE1aA670E25BA752A0F301bcD35226aa6E467fB42
// Deployed VestingCoreFacet:  0x77DCfD4af638aff0A7B0A55542775686B8aD4A86
// Deployed VestingMathFacet:  0x33EB9e0E7f4B36ea0dd2483457E7E1a8C22d2b90
// Deployed ERC6551RegistryFacet:  0x247F6C66a3235B0070c4E6717E3Ce83F98E2c8be
// Deployed TesserInit:  0x84646a4D60694c326B3bA5c01B694336a6f4e8Ff
// Deployed Implementation:  0x24d693862989de0b5684cF52bF933D6c7864b464
// Deployed FractionalStreamNFT:  0x1fE3Df604B3aeAA512526E9257D4b82bB9F29E03
// Deployed TesserToken:  0xB45B09F037f3ac0a38aD78F9307f1Be1c2a91418
// Deployed Marketplace:  0xA1dc4DA60D7AFbD3e1B3d8DE3385B60D2e5E1229

const proxyContractAddress = '0x75436f3D74CcAcB1Fa507B827420B08Fb571D9bc';

export const Contracts = {
  tesserProxy: {
    address: proxyContractAddress,
  },
  vestingCore: {
    abi: VESTING_CORE_ABI,
    address: proxyContractAddress,
  },
  vestingMath: {
    abi: VESTING_MATH_ABI,
    address: proxyContractAddress,
  },
  nft: {
    abi: FRACTIONAL_NFT_ABI,
    address: '0x1fE3Df604B3aeAA512526E9257D4b82bB9F29E03',
  },
  token: {
    abi: TESSER_TOKEN_ABI,
    address: '0xB45B09F037f3ac0a38aD78F9307f1Be1c2a91418',
  },
  marketplace: {
    abi: MARKETPLACE_ABI,
    address: '0xA1dc4DA60D7AFbD3e1B3d8DE3385B60D2e5E1229',
  },
} as const;
