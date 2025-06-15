import type { PropsWithChildren } from 'react';

import { wagmiAdapter } from '@/lib/wagmi';
import { WagmiProvider } from 'wagmi';
import { ConvexProvider } from './convex-provider';
import { QueryProvider } from './query-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    // @ts-expect-error safe
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryProvider>
        <ConvexProvider>{children}</ConvexProvider>
      </QueryProvider>
    </WagmiProvider>
  );
};
