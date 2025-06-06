import { db } from '@/db';
import { Contracts, wagmiAdapter } from '@/lib/wagmi';
import { Button } from '@tesser-streams/ui/components/button';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEventLogs } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

interface ReleaseScheduleFormProps {
  vestingId: string;
}

export const ReleaseScheduleButton = ({
  vestingId,
}: ReleaseScheduleFormProps) => {
  const [isReleasing, setIsReleasing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const onSubmit = async () => {
    try {
      setIsReleasing(true);
      if (!address) {
        throw new Error('Connect your wallet');
      }

      const hash = await writeContractAsync({
        ...Contracts.vestingCore,
        functionName: 'release',
        args: [vestingId as `0x${string}`],
      });
      const receipt = await waitForTransactionReceipt(
        wagmiAdapter.wagmiConfig,
        { hash }
      );
      const logs = parseEventLogs({
        abi: Contracts.vestingCore.abi,
        logs: receipt.logs,
      });
      const log = logs.find((log) => log.eventName === 'TokensReleased');
      const args = log?.args;
      if (!log) {
        throw new Error('Unable to get Vesting Schedule');
      }
      await db.releases.add({
        vestingId: log.args.vestingId,
        amount: log.args.amount,
        timestamp: Math.floor(Date.now() / 1000),
        transactionHash: hash,
      });
      toast.success('Successfully released');
      setIsReleasing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    } finally {
      setIsReleasing(false);
    }
  };
  return (
    <Button
      className='!rounded-lg h-8'
      onClick={onSubmit}
      disabled={isReleasing}
    >
      {isReleasing ? 'Claiming...' : 'Claim All'}
    </Button>
  );
};
