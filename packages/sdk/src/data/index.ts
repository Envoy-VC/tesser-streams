import {
  FRACTIONAL_NFT_ABI,
  MARKETPLACE_ABI,
  TESSER_TOKEN_ABI,
  VESTING_CORE_ABI,
  VESTING_MATH_ABI,
} from '~/abi';

// Ethereum Sepolia
// Deploying Counter deployer address 0x9A36a8EDAF9605F7D4dDC72F4D81463fb6f841d8
// Deployed DiamondCutFacet:  0x178758B1195fbbe68B0aD2bBdB2bF38712f7Ebb6
// Deployed OwnershipFacet:  0xC94e5f5E4829b2b9AC8938E7Fe4695F6ec1B9145
// Deployed TesserProxy:  0x1a522B6e68fE4ec21f3ddFC590dfb0957B91d86c
// Deployed DiamondLoupeFacet:  0x47CD15374793577f9003D5a43b4fFCE335aA5eA2
// Deployed VestingCoreFacet:  0xE232e81B583A0eac1b4a7AC3b36922E3b7eCDA7B
// Deployed VestingMathFacet:  0xC55a9277CF87f72E275a564c646Bd82E1B2AE0F3
// Deployed ERC6551RegistryFacet:  0x33E6bE39159adC0E3247980F220a5126C21a2f6f
// Deployed TesserInit:  0x82bC958bcCedA4B7701334f59Fbf4DD057A651e9
// Deployed Implementation:  0x2Aa6C8194367b6f4E47c9d2D2a3357971a99DD09
// Deployed FractionalStreamNFT:  0xD5B94E588026144d61f1a93872FDb50e26fb3342
// Deployed TesserToken:  0xc3de5B4b41e96dC45076842932EC14FE54AaaFD0
// Deployed Marketplace:  0x0Ef2C6093fF7A23F0201dE4436d855D92c7384C8

const proxyContractAddress = '0x1a522B6e68fE4ec21f3ddFC590dfb0957B91d86c';

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
    address: '0xD5B94E588026144d61f1a93872FDb50e26fb3342',
  },
  token: {
    abi: TESSER_TOKEN_ABI,
    address: '0xc3de5B4b41e96dC45076842932EC14FE54AaaFD0',
  },
  marketplace: {
    abi: MARKETPLACE_ABI,
    address: '0x0Ef2C6093fF7A23F0201dE4436d855D92c7384C8',
  },
} as const;
