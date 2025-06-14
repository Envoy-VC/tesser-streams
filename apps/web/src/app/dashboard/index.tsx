import { TesserStreamsLogo } from '@/components/logo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='mx-auto my-24 flex w-ful max-w-screen-lg flex-col gap-6'>
      <div className='rounded-2xl bg-[#09090b] p-4'>
        <div className='grid w-full grid-cols-3 gap-4'>
          <div className='flex h-full w-full flex-col gap-1 rounded-xl bg-[#0f0f0f] px-4 py-6'>
            <div className='text-3xl'>45</div>
            <div className='text-neutral-400 text-sm'>
              Total Streams Created
            </div>
          </div>
          <div className='flex h-full w-full flex-col gap-1 rounded-xl bg-[#0f0f0f] px-4 py-6'>
            <div className='text-3xl'>1.3M</div>
            <div className='text-neutral-400 text-sm'>Amount Vested</div>
          </div>
          <div className='flex h-full w-full flex-col gap-1 rounded-xl bg-[#0f0f0f] px-4 py-6'>
            <div className='text-3xl'>22</div>
            <div className='text-neutral-400 text-sm'>Streams Traded</div>
          </div>
        </div>
      </div>
      <div className='card-gradient flex flex-cpl flex-col gap-4 rounded-2xl border p-4'>
        <div className='flex w-full flex-col rounded-xl border bg-[#101010] p-3'>
          <div className='text-2xl'>Overview</div>
          <div className='text-neutral-400 text-sm'>
            Quick overview of your current vesting schedules and listings.
          </div>
        </div>
        <div className='flex h-full w-full flex-row items-center justify-between rounded-xl bg-[#0f0f0f]'>
          <div className='flex w-full basis-1/2 flex-col px-4 py-6'>
            <div className='flex flex-row items-center gap-2'>
              <div className='size-2 rounded-full bg-[#A394F4]' />
              <div className='text-neutral-600 text-xs'>Vested Amount</div>
            </div>
            <div className='flex flex-row items-center gap-2 text-xl'>
              <div className='font-medium text-2xl'>13,672,908</div>
              <div className='flex size-5 items-center justify-center rounded-full bg-primary'>
                <TesserStreamsLogo
                  fill='#fff'
                  stroke='#fff'
                  className='size-3'
                />
              </div>
            </div>
          </div>
          <div className='flex w-full basis-1/2 flex-col rounded-xl bg-[#0B0B0D] p-4'>
            <div className='flex flex-row items-center gap-2'>
              <div className='text-neutral-600 text-xs'>Released Amount</div>
            </div>
            <div className='flex flex-row items-center gap-2 text-xl'>
              <div className='font-medium text-2xl'>9,671,008</div>
              <div className='flex size-5 items-center justify-center rounded-full bg-primary'>
                <TesserStreamsLogo
                  fill='#fff'
                  stroke='#fff'
                  className='size-3'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
