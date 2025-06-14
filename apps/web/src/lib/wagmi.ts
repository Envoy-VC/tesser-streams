import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { http, createConfig } from 'wagmi';

import { env } from '@/env';
import { createPublicClient, defineChain } from 'viem';
import { DIAMOND_CUT_ABI } from './abi/cut';
import { TOKEN_ABI } from './abi/token';
import { VESTING_CORE_ABI } from './abi/vesting-core';
import { VESTING_MATH_ABI } from './abi/vesting-math';
const assetHub = defineChain({
  id: 420420422,
  name: 'polkadot-hub-testnet',
  network: 'polkadot-hub-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io/'],
    },
  },
});

export const publicClient = createPublicClient({
  chain: assetHub,
  transport: http(),
});

const config = createConfig({
  chains: [assetHub],
  transports: {
    [assetHub.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

const projectId = env.VITE_REOWN_PROJECT_ID;

const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const networks = [assetHub];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  // @ts-expect-error safe
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

// Deploying contracts with the account: 0xff35d8572E3caC8E8D96a24E8dCbfB8E1d1F1cA6
// DiamondCutFacet deployed to: 0xba608eCE05362A15BC8eF7038Bcb3B710Cda1Ef2
// TesserProxy deployed to: 0x9BAD627831Cf36c6d9c0e62A37dfd886b9087818
// DiamondLoupeFacet deployed to: 0xd6a59e838345a2344e74B93941C3992332C35a3d
// OwnershipFacet deployed to: 0xf322b02ab9Eb627c10eec1cE0422668B0BA2d823
// VestingCoreFacet deployed to: 0x7b7047f64b0649150a12C311E8CBa14a384357c8
// VestingMathFacet deployed to: 0x581158d99f8eE27806732CCaB6bc10d9B947dd60
// TesserToken deployed to: 0x8444eC14c268Fc49A8edF4543b92dc846fE8F049
// TesserInit deployed to: 0xC792882a5d7E8F89976AC556277508E6B492B38C

const TesserProxyContractAddress = '0x9BAD627831Cf36c6d9c0e62A37dfd886b9087818';

export const Contracts = {
  tesserProxy: {
    abi: [],
    address: TesserProxyContractAddress,
  },
  diamondCut: {
    abi: DIAMOND_CUT_ABI,
    address: TesserProxyContractAddress,
  },
  vestingCore: {
    abi: VESTING_CORE_ABI,
    address: TesserProxyContractAddress,
  },
  vestingMath: {
    abi: VESTING_MATH_ABI,
    address: TesserProxyContractAddress,
  },
  token: {
    abi: TOKEN_ABI,
    address: '0x8444eC14c268Fc49A8edF4543b92dc846fE8F049',
  },
} as const;
