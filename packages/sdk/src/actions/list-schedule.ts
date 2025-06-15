import {
  type Config,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { ListScheduleParams } from '~/types';

export const listSchedule = async (
  wagmiConfig: Config,
  params: ListScheduleParams
) => {
  const { tokenId, value } = params;

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.marketplace.abi,
    functionName: 'listNFT',
    address: Contracts.marketplace.address,
    args: [Contracts.nft.address, tokenId, value],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.marketplace.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'ItemListed');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  return { transactionHash: hash, result, receipt };
};
