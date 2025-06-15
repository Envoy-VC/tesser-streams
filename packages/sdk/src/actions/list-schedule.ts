import {
  type Config,
  readContract,
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
  const { tokenId, value, owner } = params;

  const isApprovedForMarketplace = await readContract(wagmiConfig, {
    abi: Contracts.nft.abi,
    functionName: 'isApprovedForAll',
    address: Contracts.nft.address,
    args: [owner, Contracts.marketplace.address],
  });

  if (!isApprovedForMarketplace) {
    const h = await writeContract(wagmiConfig, {
      abi: Contracts.nft.abi,
      functionName: 'setApprovalForAll',
      address: Contracts.nft.address,
      args: [Contracts.marketplace.address, true],
    });
    await waitForTransactionReceipt(wagmiConfig, { hash: h });
  }

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

  return { transactionHash: hash, result: result, receipt };
};
