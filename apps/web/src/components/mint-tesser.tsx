import { Button } from '@tesser-streams/ui/components/button';
import { Input } from '@tesser-streams/ui/components/input';
import { CirclePlusIcon } from 'lucide-react';

export const MintTesser = () => {
  return (
    <div className='card-gradient flex w-full max-w-xl flex-col gap-2 rounded-3xl border p-6'>
      <div className='flex flex-col gap-2'>
        <div className='w-fit font-medium text-2xl text-neutral-100'>
          Mint Tesser Tokens
        </div>
        <p className='text-base text-neutral-400'>
          Tesser Tokens (TES) are used to create and Manage Fractional Vesting
          Schedules.
        </p>
      </div>
      <div className='my-4 flex flex-row items-center rounded-2xl border p-3'>
        <Input
          placeholder='0.00'
          type='number'
          step={1}
          min={0}
          max={100000}
          className='!text-5xl [&::-moz-appearance]:textfield h-12 w-full appearance-none border-none px-0 placeholder:text-5xl placeholder:text-neutral-400 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
        />
      </div>
      <Button
        className='!font-medium !text-base flex flex-row items-center justify-center gap-2 rounded-xl'
        variant='default'
      >
        <CirclePlusIcon />
        Mint Tokens
      </Button>
    </div>
  );
};
