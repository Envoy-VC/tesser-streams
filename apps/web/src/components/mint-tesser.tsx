import { Button } from '@tesser-streams/ui/components/button';
import { Input } from '@tesser-streams/ui/components/input';
import { waitForTransactionReceipt } from '@wagmi/core';
import { CirclePlusIcon, Loader2Icon } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { TesserStreamsLogo } from './logo';

import { wagmiAdapter } from '@/lib/wagmi';
import { Contracts } from '@tesser-streams/sdk';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';

export const MintTesser = () => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const [amount, setAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (!address) {
        throw new Error('Connect your wallet');
      }
      const value = parseEther(amount);
      if (value === 0n) {
        throw new Error('Amount must be greater than 0');
      }
      const hash = await writeContractAsync({
        ...Contracts.token,
        functionName: 'mint',
        args: [address, value],
      });
      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });
      toast.success('Successfully minted');
      setAmount('');
      setIsMinting(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(error);
      toast.error(message);
    } finally {
      setIsMinting(false);
    }
  };
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
      <div className='my-4 flex flex-row items-center justify-between rounded-2xl border p-3'>
        <Input
          placeholder='0.00'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          step={1}
          min={0}
          max={100000}
          className='!text-5xl [&::-moz-appearance]:textfield h-12 w-full appearance-none border-none px-0 placeholder:text-5xl placeholder:text-neutral-400 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
        />
        <div className='flex max-h-12 min-h-12 min-w-12 max-w-12 items-center justify-center rounded-full border border-neutral-600 bg-primary'>
          <TesserStreamsLogo
            fill='#fff'
            stroke='#fff'
            className='size-6'
          />
        </div>
      </div>
      <Button
        className='!font-medium !text-base flex flex-row items-center justify-center gap-2 rounded-xl'
        variant='default'
        onClick={onMint}
        disabled={isMinting}
      >
        {isMinting ? (
          <Loader2Icon className='animate-spin' />
        ) : (
          <CirclePlusIcon />
        )}
        {isMinting ? 'Minting...' : 'Mint Tokens'}
      </Button>
    </div>
  );
};
