import NumberFlow from '@number-flow/react';

import { computeReleasable, getScheduleDetails } from '@/lib/helpers';
import { Contracts } from '@/lib/wagmi';
import { useEffect, useMemo, useState } from 'react';
import { useReadContract } from 'wagmi';
import { TesserStreamsLogo } from '../logo';
import { ReleaseScheduleButton } from './release';
import { ReleasesTable } from './releases-table';
import { VestingChart } from './vesting-chart';

interface VestingDetailsProps {
  vestingId: string;
}

export const VestingDetails = ({ vestingId }: VestingDetailsProps) => {
  const { data: schedule } = useReadContract({
    ...Contracts.vestingCore,
    functionName: 'getVestingSchedule',
    args: [vestingId as `0x${string}`],
  });

  const details = useMemo(() => {
    return getScheduleDetails(schedule);
  }, [schedule]);

  const [releasableAmount, setReleasableAmount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      const release = computeReleasable(schedule);
      console.log(release);
      setReleasableAmount(release);
    }, 1000);
    return () => clearInterval(interval);
  }, [details]);

  return (
    <div className='mx--auto mt-24 flex w-full max-w-screen-xl flex-col gap-4'>
      <div className='flex w-full flex-row gap-4 rounded-2xl border bg-[#08080A] p-4'>
        <div className='flex w-full basis-1/3'>
          <div className='flex flex-col'>
            <div className='flex w-full flex-col gap-2 rounded-t-xl border bg-[#0D0D0E] p-4'>
              <div className='font-medium text-xl'>Your Claimable TES</div>
              <div className='text-neutral-400 text-sm'>
                Claim your Releasable TES tokens from this vesting schedule.
              </div>
              <div className='flex flex-row items-center gap-2 pt-4'>
                <div className='flex size-10 items-center justify-center rounded-full border border-neutral-500 bg-primary'>
                  <TesserStreamsLogo
                    fill='#fff'
                    stroke='#fff'
                    className='size-6'
                  />
                </div>
                <NumberFlow
                  value={Number(releasableAmount)}
                  suffix='TES'
                  className='flex items-center gap-2 text-4xl'
                />
              </div>
              <div className='flex justify-end'>
                <ReleaseScheduleButton vestingId={vestingId} />
              </div>
            </div>
            <div className='flex h-48 items-center justify-center rounded-b-xl border-r border-b border-l bg-black bg-gradient-to-r from-[rgba(19,17,36,.5)] via-black to-[rgba(19,17,36,.5)] text-center text-[rgb(100,74,238)] text-xl'>
              Vesting Completes in {details.vestingEndsIn}
            </div>
          </div>
        </div>
        <div className='flex w-full basis-2/3 flex-col gap-2'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Total Vesting Amount
              </div>
              <div className='text-2xl'>
                {details.totalAmount.formatted} TES
              </div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Cliff Duration
              </div>
              <div className='text-2xl'>{details.cliffDuration.formatted}</div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Vesting Duration
              </div>
              <div className='text-2xl'>
                {details.vestingDuration.formatted}
              </div>
            </div>
          </div>
          <VestingChart schedule={schedule} />
        </div>
      </div>
      <ReleasesTable vestingId={vestingId} />
    </div>
  );
};
