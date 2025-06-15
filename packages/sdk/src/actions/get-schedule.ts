import { type Config, readContract } from '@wagmi/core';
import { Contracts } from '~/data';

import type { GetVestingScheduleParams } from '~/types';
import type { VestingSchedule } from '~/zod';

export const getVestingSchedule = async (
  wagmiConfig: Config,
  params: GetVestingScheduleParams
): Promise<VestingSchedule> => {
  const res = await readContract(wagmiConfig, {
    abi: Contracts.vestingCore.abi,
    functionName: 'getVestingSchedule',
    address: Contracts.vestingCore.address,
    args: [params.vestingId],
  });

  const beneficiary = await readContract(wagmiConfig, {
    abi: Contracts.vestingCore.abi,
    functionName: 'getBeneficiaryForVestingId',
    address: Contracts.vestingCore.address,
    args: [params.vestingId],
  });

  return { ...res, beneficiary, vestingId: params.vestingId };
};
