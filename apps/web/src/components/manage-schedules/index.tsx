import { api } from '@/convex/_generated/api';
import { timeBetween } from '@/lib/helpers';
import { Link } from '@tanstack/react-router';
import { Button } from '@tesser-streams/ui/components/button';
import { useQuery } from 'convex/react';
import PlaceholderImage from 'public/images/placeholder.png';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { TesserStreamsLogo } from '../logo';

export const ManageSchedules = () => {
  const { address } = useAccount();
  const schedules = useQuery(
    api.functions.vesting.getVestingSchedulesForBeneficiary,
    address ? { beneficiary: address } : 'skip'
  );

  return (
    <div className='card-gradient mx-auto my-24 flex max-w-screen-lg flex-cpl flex-col gap-4 rounded-2xl border p-4'>
      <div className='flex w-full flex-col rounded-xl border bg-[#101010] p-3'>
        <div className='text-2xl'>Your Schedules</div>
        <div className='text-neutral-400 text-sm'>
          View and manage your schedules.
        </div>
      </div>
      <div className='my-6 flex flex-row flex-wrap items-center gap-3'>
        {schedules && schedules.length > 0 ? (
          schedules?.map((schedule) => (
            <div
              key={schedule.vestingId}
              className='flex w-full max-w-[16rem] flex-col rounded-xl border bg-[#101010]'
            >
              <div className='flex flex-col gap-1 rounded-t-xl border-b p-3'>
                <div className='text-neutral-400 text-xs'>AMOUNT</div>
                <div className='flex flex-row items-center gap-2'>
                  <div className='text-2xl'>
                    {formatEther(BigInt(schedule.totalAmount))}
                  </div>
                  <div className='flex size-6 items-center justify-center rounded-full bg-primary'>
                    <TesserStreamsLogo
                      fill='#fff'
                      stroke='#fff'
                      className='size-4'
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-row items-center justify-between p-3'>
                <div className='text-neutral-300 text-xs'>
                  {timeBetween(
                    schedule.startTime,
                    Math.floor(Date.now() / 1000),
                    true
                    // biome-ignore lint/nursery/useConsistentCurlyBraces: <explanation>
                  )}{' '}
                  ago
                </div>
                <Button
                  asChild={true}
                  variant='outline'
                  className='brightness-125 hover:brightness-100'
                >
                  <Link
                    to='/dashboard/manage/$vestingId'
                    params={{ vestingId: schedule.vestingId }}
                  >
                    Manage
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className='mx-auto flex flex-col items-center gap-3'>
            <div className='text-neutral-300 text-sm'>Nothing to show here</div>
            {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
            <img
              width={128}
              height={128}
              src={PlaceholderImage}
              alt='Empty State'
            />
          </div>
        )}
      </div>
    </div>
  );
};
