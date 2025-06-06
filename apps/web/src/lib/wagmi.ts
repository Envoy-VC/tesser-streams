import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { http, createConfig } from 'wagmi';

import { env } from '@/env';
import { defineChain } from 'viem';
const assetHub = defineChain({
  id: 420420421,
  name: 'polkadot-hub-testnet',
  network: 'polkadot-hub-testnet',
  testnet: true,
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
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
