import { TesserStreamsLogo } from '@/components/logo';
import { generateDeterministicGradient } from '@/lib/gradient';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/marketplace')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='card-gradient mx-auto my-24 flex max-w-screen-lg flex-cpl flex-col gap-4 rounded-2xl border p-4'>
      <div className='flex w-full flex-col rounded-xl border bg-[#101010] p-3'>
        <div className='text-2xl'>Marketplace</div>
        <div className='text-neutral-400 text-sm'>
          Explore the marketplace and find the best streams to trade and invest
          in.
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
        <TradableStreamCard />
      </div>
    </div>
  );
}

const TradableStreamCard = () => {
  const grad = generateDeterministicGradient(crypto.randomUUID());
  return (
    <div className='group relative flex h-[18rem] w-full flex-col overflow-hidden rounded-2xl border-2'>
      <div className='h-[12rem] overflow-hidden rounded-t-2xl'>
        <div
          className='h-[12rem] overflow-hidden rounded-t-2xl transition-transform duration-300 ease-in-out group-hover:scale-125'
          style={{ background: grad }}
        />
      </div>
      <div className='flex w-full flex-col gap-1 px-4 py-3'>
        <div className='font-medium text-base'>#32</div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-medium text-neutral-400 text-sm'>Vested:</div>
          <div className='flex flex-row items-center gap-1'>
            <div className='text-sm'>1.34M</div>
            <div className='flex size-5 items-center justify-center rounded-full bg-primary'>
              <TesserStreamsLogo
                fill='#fff'
                stroke='#fff'
                className='size-3'
              />
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-medium text-neutral-400 text-sm'>Alpha:</div>
          <div className='flex flex-row items-center gap-1'>
            <div className='text-sm'>0.8</div>
          </div>
        </div>
      </div>
      <Link
        to='/dashboard/manage/$vestingId'
        params={{ vestingId: '1234' }}
        className='card-gradient -bottom-12 group-hover:-translate-y-12 absolute flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border-t bg-[#0f0f0f] px-4 py-2 font-medium text-base text-neutral-400 transition-transform duration-300 ease-in-out'
      >
        Trade
      </Link>
    </div>
  );
};
