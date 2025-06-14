import { createFileRoute } from '@tanstack/react-router';

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
      <div className='h-10 w-full rounded-2xl border'>a</div>
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
  return <div className='h-[20rem] w-full rounded-2xl border-2'></div>;
};
