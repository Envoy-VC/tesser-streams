import type { PropsWithChildren } from 'react';

import { wagmiAdapter } from '@/lib/wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryProvider } from './query-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    // @ts-expect-error safe
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryProvider>{children}</QueryProvider>
    </WagmiProvider>
  );
};
