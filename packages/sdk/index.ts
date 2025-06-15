import { TesserStreamsClient } from '@tesser-streams/sdk';

import { http, createConfig } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const client = new TesserStreamsClient(config);

const { result } = await client.createVestingSchedule({
  beneficiary: '0x...',
  tokenAddress: '0x...',
  totalAmount: 1000n,
  cliffDuration: 30,
  vestingDuration: 365,
  alpha: BigInt(0.5 * 10 ** 18),
});
