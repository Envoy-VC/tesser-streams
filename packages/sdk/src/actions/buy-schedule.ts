import {
  type Config,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { parseEventLogs } from 'viem';
import { Contracts } from '~/data';
import type { BuyScheduleParams } from '~/types';

export const buySchedule = async (
  wagmiConfig: Config,
  params: BuyScheduleParams
) => {
  const { tokenId, buyer } = params;

  // Get Listing
  const [seller, price] = await readContract(wagmiConfig, {
    abi: Contracts.marketplace.abi,
    functionName: 'listings',
    address: Contracts.marketplace.address,
    args: [Contracts.nft.address, tokenId],
  });

  // Check token allowance for marketplace
  const allowance = await readContract(wagmiConfig, {
    abi: Contracts.token.abi,
    functionName: 'allowance',
    address: Contracts.token.address,
    args: [buyer, Contracts.marketplace.address],
  });

  if (allowance < price) {
    const h = await writeContract(wagmiConfig, {
      abi: Contracts.token.abi,
      functionName: 'approve',
      address: Contracts.token.address,
      args: [Contracts.marketplace.address, price],
    });
    await waitForTransactionReceipt(wagmiConfig, { hash: h });
  }

  const hash = await writeContract(wagmiConfig, {
    abi: Contracts.marketplace.abi,
    functionName: 'buyNFT',
    address: Contracts.marketplace.address,
    args: [Contracts.nft.address, tokenId],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  const logs = parseEventLogs({
    abi: Contracts.marketplace.abi,
    logs: receipt.logs,
  });
  const log = logs.find((log) => log.eventName === 'ItemBought');
  const result = log?.args;
  if (!result) {
    throw new Error('Unable to get Vesting Schedule');
  }

  return { transactionHash: hash, result, receipt };
};
