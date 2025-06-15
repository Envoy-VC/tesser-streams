import {
  FRACTIONAL_NFT_ABI,
  MARKETPLACE_ABI,
  TESSER_TOKEN_ABI,
  VESTING_CORE_ABI,
  VESTING_MATH_ABI,
} from '~/abi';

// Deploying contracts with the account: 0x9A36a8EDAF9605F7D4dDC72F4D81463fb6f841d8
// DiamondCutFacet deployed to: 0xAa411Cc7d50170594deDfBCEB8f7869eECBAcdF5
// OwnershipFacet deployed to: 0xad2e9Ba93e4310e4861F627E48E5564c1C1578d6
// TesserProxy deployed to: 0xD34C86591a2c0f14780528eCAC30521D29759fB2
// DiamondLoupeFacet deployed to: 0xDdFc18C1c306378B75925e95ef9960A0FA7447cC
// VestingCoreFacet deployed to: 0x1668F636f944e9fcb5E1399C22A4402a62BCDfDA
// VestingMathFacet deployed to: 0xB480CD00B67B9EB4f77F9258FE9E4f7642013889
// ERC6551RegistryFacet deployed to: 0x85D5136d1C1603b053d5D241cB81DB6351aEd90a
// TesserToken deployed to: 0xf3AE9a910Ef8A90197CF80AeCb424c07a1dEeB61
// TesserInit deployed to: 0x963288C37c071c603Bfa766EEd1B81e2C8825069
// Implementation deployed to: 0x0FB4e2BBFEC7839E885217731D35da567Fa8dd1D
// FractionalStreamNFT deployed to: 0xcDfb1932B902F7c4558fC67268C29a0a90C269ef
// Marketplace deployed to: 0x6FAEe8b4010221DB07D75A802b8b228f317e0e88
// FacetCut done

const proxyContractAddress = '0xD34C86591a2c0f14780528eCAC30521D29759fB2';

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
    address: '0xcDfb1932B902F7c4558fC67268C29a0a90C269ef',
  },
  token: {
    abi: TESSER_TOKEN_ABI,
    address: '0xf3AE9a910Ef8A90197CF80AeCb424c07a1dEeB61',
  },
  marketplace: {
    abi: MARKETPLACE_ABI,
    address: '0x6FAEe8b4010221DB07D75A802b8b228f317e0e88',
  },
} as const;
