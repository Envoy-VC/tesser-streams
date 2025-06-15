import {
  type Config,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { ApproveTokenParams } from '~/types';

export const approveToken = async (
  wagmiConfig: Config,
  params: ApproveTokenParams
) => {
  const { spender, value } = params;

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.token.abi,
    functionName: 'approve',
    address: Contracts.token.address,
    args: [spender, value],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.token.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'Approval');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  return { transactionHash: hash, result, receipt };
};
