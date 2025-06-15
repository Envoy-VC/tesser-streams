import {
  type Config,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { ReleaseScheduleParams } from '~/types';
import { getVestingSchedule } from './get-schedule';

export const releaseSchedule = async (
  wagmiConfig: Config,
  params: ReleaseScheduleParams
) => {
  const { vestingId } = params;

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.vestingCore.abi,
    functionName: 'release',
    address: Contracts.vestingCore.address,
    args: [vestingId],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.vestingCore.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'TokensReleased');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  const schedule = await getVestingSchedule(wagmiConfig, {
    vestingId: result.vestingId,
  });

  return {
    transactionHash: hash,
    result,
    receipt,
  };
};
