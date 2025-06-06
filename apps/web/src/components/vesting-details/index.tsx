import { Button } from '@tesser-streams/ui/components/button';
import { TesserStreamsLogo } from '../logo';
import { ReleasesTable } from './releases-table';
import { VestingChart } from './vesting-chart';

export const VestingDetails = () => {
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
                <div className='text-4xl'>34.213 TES</div>
              </div>
              <div className='flex justify-end'>
                <Button className='!rounded-lg h-8'>Claim All</Button>
              </div>
            </div>
            <div className='flex h-48 items-center justify-center rounded-b-xl border-r border-b border-l bg-black bg-gradient-to-r from-[rgba(19,17,36,.5)] via-black to-[rgba(19,17,36,.5)] text-[rgb(100,74,238)] text-xl'>
              Vesting Completes in 4d 23h 59m
            </div>
          </div>
        </div>
        <div className='flex w-full basis-2/3 flex-col gap-2'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Total Vesting Amount
              </div>
              <div className='text-2xl'>100,000 TES</div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Cliff Duration
              </div>
              <div className='text-2xl'>1 Month</div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Vesting Duration
              </div>
              <div className='text-2xl'>11 Months</div>
            </div>
          </div>
          <VestingChart />
        </div>
      </div>
      <ReleasesTable />
    </div>
  );
};
