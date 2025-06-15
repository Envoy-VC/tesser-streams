import {
  FRACTIONAL_NFT_ABI,
  MARKETPLACE_ABI,
  TESSER_TOKEN_ABI,
  VESTING_CORE_ABI,
  VESTING_MATH_ABI,
} from '~/abi';

const proxyContractAddress = '0x';

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
    address: '0x',
  },
  token: {
    abi: TESSER_TOKEN_ABI,
    address: '0x',
  },
  marketplace: {
    abi: MARKETPLACE_ABI,
    address: '0x',
  },
} as const;
