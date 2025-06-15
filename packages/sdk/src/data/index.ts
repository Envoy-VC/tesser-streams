import {
  FRACTIONAL_NFT_ABI,
  MARKETPLACE_ABI,
  TESSER_TOKEN_ABI,
  VESTING_CORE_ABI,
  VESTING_MATH_ABI,
} from '~/abi';

const proxyContractAddress = '0xB45B09F037f3ac0a38aD78F9307f1Be1c2a91418';

export const Contracts = {
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
    address: '0x801Cd04a58150ce5560F3215B771A0Af0B11195d',
  },
  token: {
    abi: TESSER_TOKEN_ABI,
    address: '0x63903e1f0869CA55ADD4d0B1189631955A37f2eA',
  },
  marketplace: {
    abi: MARKETPLACE_ABI,
    address: '0x',
  },
} as const;
