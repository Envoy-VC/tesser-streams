import { TesserStreamsLogo } from '@/components/logo';
import { api } from '@/convex/_generated/api';
import { generateDeterministicGradient } from '@/lib/gradient';
import { formatCurrency } from '@/lib/helpers';
import type { ScheduleListing } from '@/lib/zod';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import PlaceholderImage from 'public/images/placeholder.png';

export const Route = createFileRoute('/dashboard/marketplace')({
  component: RouteComponent,
});

function RouteComponent() {
  const listings = useQuery(api.functions.marketplace.list);
  return (
    <div className='card-gradient mx-auto my-24 flex max-w-screen-lg flex-cpl flex-col gap-4 rounded-2xl border p-4'>
      <div className='flex w-full flex-col rounded-xl border bg-[#101010] p-3'>
        <div className='text-2xl'>Marketplace</div>
        <div className='text-neutral-400 text-sm'>
          Explore the marketplace and find the best streams to trade and invest
          in.
        </div>
      </div>

      {listings && listings.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
          {listings.map((listing) => (
            <TradableStreamCard
              key={listing.tokenId}
              {...listing}
            />
          ))}
        </div>
      ) : (
        <div className='mx-auto flex flex-col items-center gap-3 p-4 '>
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
  );
}

const TradableStreamCard = (data: ScheduleListing) => {
  const grad = generateDeterministicGradient(data.tokenId.toString());
  const schedule = useQuery(
    api.functions.vesting.getVestingSchedulesForTokenId,
    { tokenId: data.tokenId }
  );
  return (
    <div className='group relative flex h-[18rem] w-full flex-col overflow-hidden rounded-2xl border-2'>
      <div className='h-[12rem] overflow-hidden rounded-t-2xl'>
        <div
          className='h-[12rem] overflow-hidden rounded-t-2xl transition-transform duration-300 ease-in-out group-hover:scale-125'
          style={{ background: grad }}
        />
      </div>
      <div className='flex w-full flex-col gap-1 px-4 py-3'>
        <div className='font-medium text-base'>#{data.tokenId}</div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-medium text-neutral-400 text-sm'>
            Releasable:
          </div>
          <div className='flex flex-row items-center gap-1'>
            <div className='text-sm'>
              {formatCurrency(
                (Number(schedule?.totalAmount ?? 0) -
                  Number(schedule?.released ?? 0)) /
                  1e18
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-medium text-neutral-400 text-sm'>Alpha:</div>
          <div className='flex flex-row items-center gap-1'>
            <div className='text-sm'>
              {(Number(schedule?.alpha ?? 0) / 1e18).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className='absolute right-3 bottom-3'>
        <div className='flex flex-row items-center gap-1'>
          <div className='text-sm'>
            {formatCurrency(Number(data.price) / 1e18)}
          </div>
          <div className='flex size-5 items-center justify-center rounded-full bg-primary'>
            <TesserStreamsLogo
              fill='#fff'
              stroke='#fff'
              className='size-3'
            />
          </div>
        </div>
      </div>
      <Link
        to='/dashboard/manage/$vestingId'
        params={{ vestingId: schedule?.vestingId ?? '' }}
        className='card-gradient -bottom-12 group-hover:-translate-y-12 absolute flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border-t bg-[#0f0f0f] px-4 py-2 font-medium text-base text-neutral-400 transition-transform duration-300 ease-in-out'
      >
        Trade
      </Link>
    </div>
  );
};
