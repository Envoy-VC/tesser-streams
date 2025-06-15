import {
  type Config,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { RemoveScheduleListingParams } from '~/types';

export const removeScheduleListing = async (
  wagmiConfig: Config,
  params: RemoveScheduleListingParams
) => {
  const { tokenId } = params;

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.marketplace.abi,
    functionName: 'cancelListing',
    address: Contracts.marketplace.address,
    args: [Contracts.nft.address, tokenId],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.marketplace.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'ItemCanceled');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  return { transactionHash: hash, result, receipt };
};
