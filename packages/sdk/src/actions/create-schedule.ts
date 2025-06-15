import {
  type Config,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { CreateVestingScheduleParams } from '~/types';
import type { VestingSchedule } from '~/zod';
import { getVestingSchedule } from './get-schedule';

export const createVestingSchedule = async (
  wagmiConfig: Config,
  params: CreateVestingScheduleParams
) => {
  const {
    beneficiary,
    tokenAddress,
    totalAmount,
    cliffDuration,
    vestingDuration,
    alpha,
  } = params;

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.vestingCore.abi,
    functionName: 'createVestingSchedule',
    address: Contracts.vestingCore.address,
    args: [
      beneficiary,
      tokenAddress,
      totalAmount,
      cliffDuration,
      vestingDuration,
      alpha,
    ],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.vestingCore.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'ScheduleCreated');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  const schedule = await getVestingSchedule(wagmiConfig, {
    vestingId: result.vestingId,
  });

  return {
    transactionHash: hash,
    result: { ...schedule, vestingId: result.vestingId } as VestingSchedule,
    receipt,
  };
};
