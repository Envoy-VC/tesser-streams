import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { http, createConfig } from 'wagmi';

import { env } from '@/env';
import { createPublicClient, defineChain } from 'viem';
import { sepolia } from 'viem/chains';
const assetHub = defineChain({
  id: 420420421,
  name: 'polkadot-hub-testnet',
  network: 'polkadot-hub-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
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

const networks = [sepolia];

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
