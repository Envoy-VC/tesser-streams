import { type Config, readContract } from '@wagmi/core';
import { Contracts } from '~/data';

import type { GetAllowanceParams } from '~/types';

export const getTokenAllowance = async (
  wagmiConfig: Config,
  params: GetAllowanceParams
): Promise<bigint> => {
  const res = await readContract(wagmiConfig, {
    abi: Contracts.token.abi,
    functionName: 'allowance',
    address: Contracts.token.address,
    args: [params.owner, params.spender],
  });

  return res;
};
