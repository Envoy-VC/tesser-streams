import { api } from '@/convex/_generated/api';
import { wagmiAdapter } from '@/lib/wagmi';
import { TesserStreamsClient } from '@tesser-streams/sdk';
import { Button } from '@tesser-streams/ui/components/button';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

interface ReleaseScheduleFormProps {
  vestingId: string;
}

export const ReleaseScheduleButton = ({
  vestingId,
}: ReleaseScheduleFormProps) => {
  const [isReleasing, setIsReleasing] = useState(false);
  const { address } = useAccount();

  const updateScheduleMutation = useMutation(
    api.functions.vesting.updateVestingSchedule
  );

  const releaseScheduleMutation = useMutation(
    api.functions.vesting.releaseSchedule
  );

  const onSubmit = async () => {
    try {
      setIsReleasing(true);
      if (!address) {
        throw new Error('Connect your wallet');
      }

      const tesser = new TesserStreamsClient(wagmiAdapter.wagmiConfig);
      const { result, transactionHash } = await tesser.releaseSchedule({
        vestingId: vestingId as `0x${string}`,
      });

      // Update DB With new schedule
      const newSchedule = await tesser.getVestingSchedule({
        vestingId: result.vestingId as `0x${string}`,
      });
      await updateScheduleMutation({ updated: newSchedule });

      // Update Release
      await releaseScheduleMutation({ ...result, transactionHash });

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
