import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@tesser-streams/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tesser-streams/ui/components/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tesser-streams/ui/components/select';

import { db } from '@/db';
import { getDuration } from '@/lib/helpers';
import { Contracts, wagmiAdapter } from '@/lib/wagmi';
import { Input } from '@tesser-streams/ui/components/input';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { CirclePlusIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEther, parseEventLogs } from 'viem';
import { useAccount, useWatchContractEvent, useWriteContract } from 'wagmi';
import { VestingChart } from './vesting-chart';

const alphaValues = [
  {
    label: '0.3',
    value: 0.3,
    description: 'Early Acceleration',
  },
  {
    label: '0.5',
    value: 0.5,
    description: 'Square-Root Vesting',
  },
  {
    label: '0.7',
    value: 0.7,
    description: 'Late Acceleration',
  },
];

const formSchema = z.object({
  beneficiary: z.string({ message: 'Beneficiary is required' }).refine((v) => {
    return /^0x[a-fA-F0-9]{40}$/.test(v);
  }, 'Invalid Ethereum address'),
  cliffParams: z.object({
    duration: z.number({ message: 'Cliff duration is required' }),
    unit: z.union([
      z.literal('days'),
      z.literal('weeks'),
      z.literal('months'),
      z.literal('years'),
    ]),
  }),
  vestingParams: z.object({
    duration: z.number({ message: 'Vesting duration is required' }),
    unit: z.union([
      z.literal('days'),
      z.literal('weeks'),
      z.literal('months'),
      z.literal('years'),
    ]),
  }),
  totalAmount: z.number({ message: 'Total amount is required' }),
  alpha: z.number({ message: 'Alpha is required' }).min(0.1).max(0.9),
});

export const CreateVestingForm = () => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiary: address ?? undefined,
      cliffParams: {
        unit: 'months',
      },
      vestingParams: {
        unit: 'years',
      },
      alpha: 0.5,
    },
  });

  useWatchContractEvent({
    ...Contracts.vestingCore,
    eventName: 'ScheduleCreated',
    onLogs(logs) {
      console.log('New logs!', logs);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsCreating(true);
      if (!address) {
        throw new Error('Connect your wallet');
      }
      const value = parseEther(values.totalAmount.toString());
      if (value === 0n) {
        throw new Error('Amount must be greater than 0');
      }
      const cliffDuration = getDuration(
        values.cliffParams.duration,
        values.cliffParams.unit
      );
      const vestingDuration = getDuration(
        values.vestingParams.duration,
        values.vestingParams.unit
      );

      if (vestingDuration <= 0) {
        throw new Error('Vesting duration must be greater than 0');
      }

      const needsApproval =
        (await readContract(wagmiAdapter.wagmiConfig, {
          ...Contracts.token,
          functionName: 'allowance',
          args: [address, Contracts.tesserProxy.address],
        })) < value;

      if (needsApproval) {
        const approvalHash = await writeContractAsync({
          ...Contracts.token,
          functionName: 'approve',
          args: [Contracts.tesserProxy.address, value],
        });
        await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
          hash: approvalHash,
        });
      }

      const hash = await writeContractAsync({
        ...Contracts.vestingCore,
        functionName: 'createVestingSchedule',
        args: [
          values.beneficiary as `0x${string}`,
          Contracts.token.address,
          value,
          cliffDuration,
          vestingDuration,
          parseEther(values.alpha.toString()),
        ],
      });
      const receipt = await waitForTransactionReceipt(
        wagmiAdapter.wagmiConfig,
        { hash }
      );
      const logs = parseEventLogs({
        abi: Contracts.vestingCore.abi,
        logs: receipt.logs,
      });
      const log = logs.find((log) => log.eventName === 'ScheduleCreated');
      const args = log?.args;
      if (!log) {
        throw new Error('Unable to get Vesting Schedule');
      }
      await db.schedules.add({
        vestingId: log.args.vestingId,
        beneficiary: values.beneficiary,
        token: Contracts.token.address,
        totalAmount: log.args.totalAmount,
        feeAmount: log.args.feeAmount,
        cliffDuration,
        vestingDuration,
        alpha: values.alpha,
        startAt: Math.floor(Date.now() / 1000),
      });
      toast.success('Successfully created vesting schedule');
      form.reset({
        beneficiary: address ?? undefined,
        cliffParams: {
          unit: 'months',
        },
        vestingParams: {
          unit: 'years',
        },
        alpha: 0.5,
      });
      setIsCreating(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const alpha = form.watch('alpha');

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-3'
        >
          <FormField
            control={form.control}
            name='beneficiary'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-neutral-300'>
                  Beneficiary Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='0x...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='pb-2 text-neutral-300 text-sm'>
                Vesting Duration
              </div>
              <div className='flex flex-row items-center gap-2'>
                <FormField
                  control={form.control}
                  name='vestingParams.duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='1'
                          className='w-[10rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='vestingParams.unit'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='years'>Years</SelectItem>
                          <SelectItem value='months'>Months</SelectItem>
                          <SelectItem value='weeks'>Weeks</SelectItem>
                          <SelectItem value='days'>Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='pb-2 text-neutral-300 text-sm'>
                Cliff Duration
              </div>
              <div className='flex flex-row items-center gap-2'>
                <FormField
                  control={form.control}
                  name='cliffParams.duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1'
                          className='w-[10rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='cliffParams.unit'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='years'>Years</SelectItem>
                          <SelectItem value='months'>Months</SelectItem>
                          <SelectItem value='weeks'>Weeks</SelectItem>
                          <SelectItem value='days'>Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name='totalAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-neutral-300'>Total Amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step={1}
                    min={0}
                    placeholder='10,000,000'
                    className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-2'>
            <FormField
              control={form.control}
              name='alpha'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-neutral-300'>Alpha</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={0.01}
                      min={0.1}
                      max={0.9}
                      placeholder='0.5'
                      className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-3 gap-2'>
              {alphaValues.map(({ label, value, description }) => (
                <button
                  type='button'
                  key={label}
                  className='flex cursor-pointer flex-col items-center rounded-xl border border-primary bg-primary/20 px-3 py-1'
                  onClick={() => {
                    form.setValue('alpha', value);
                  }}
                >
                  <div className='w-fit font-medium text-neutral-200 text-sm'>
                    {description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='py-2'>
            <VestingChart alpha={alpha} />
          </div>

          <Button
            className='!font-medium !text-base mt-5 flex w-full flex-row items-center justify-center gap-2 rounded-xl'
            variant='default'
            type='submit'
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2Icon className='animate-spin' />
            ) : (
              <CirclePlusIcon />
            )}
            {isCreating ? 'Creating Schedule...' : 'Create Schedule'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

/**
 * blockHash
: 
"0x848f796df7b9cd35f60d0c4a0949cce3ca9c5bda493aec323045dd52321d4256"
blockNumber
: 
121350n
chainId
: 
420420421
contractAddress
: 
null
cumulativeGasUsed
: 
0n
effectiveGasPrice
: 
1200n
from
: 
"0xff35d8572e3cac8e8d96a24e8dcbfb8e1d1f1ca6"
gasUsed
: 
330564150833n
logs
: 
Array(3)
0
: 
address
: 
"0x8444ec14c268fc49a8edf4543b92dc846fe8f049"
blockHash
: 
"0x848f796df7b9cd35f60d0c4a0949cce3ca9c5bda493aec323045dd52321d4256"
blockNumber
: 
121350n
data
: 
"0x0000000000000000000000000000000000000000000000056bc75e2d63100000"
logIndex
: 
4
topics
: 
(3) ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x000000000000000000000000ff35d8572e3cac8e8d96a24e8dcbfb8e1d1f1ca6', '0x0000000000000000000000009bad627831cf36c6d9c0e62a37dfd886b9087818']
transactionHash
: 
"0x09016cdf99fb3a11d14bf42f6ad5e15a16e05b16b8779a5b5c23910004c45407"
transactionIndex
: 
2
[[Prototype]]
: 
Object
1
: 
address
: 
"0x8444ec14c268fc49a8edf4543b92dc846fe8f049"
blockHash
: 
"0x848f796df7b9cd35f60d0c4a0949cce3ca9c5bda493aec323045dd52321d4256"
blockNumber
: 
121350n
data
: 
"0x0000000000000000000000000000000000000000000000004563918244f40000"
logIndex
: 
5
topics
: 
(3) ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x0000000000000000000000009bad627831cf36c6d9c0e62a37dfd886b9087818', '0x000000000000000000000000ff35d8572e3cac8e8d96a24e8dcbfb8e1d1f1ca6']
transactionHash
: 
"0x09016cdf99fb3a11d14bf42f6ad5e15a16e05b16b8779a5b5c23910004c45407"
transactionIndex
: 
2
[[Prototype]]
: 
Object
2
: 
address
: 
"0x9bad627831cf36c6d9c0e62a37dfd886b9087818"
blockHash
: 
"0x848f796df7b9cd35f60d0c4a0949cce3ca9c5bda493aec323045dd52321d4256"
blockNumber
: 
121350n
data
: 
"0x0000000000000000000000008444ec14c268fc49a8edf4543b92dc846fe8f0490000000000000000000000000000000000000000000000052663ccab1e1c00000000000000000000000000000000000000000000000000004563918244f40000"
logIndex
: 
6
topics
: 
(3) ['0x79a25b68bf41feb92c04f0092828f67b8e19a21f057e3ffe1d48ed40f4c5b94f', '0xd23fb1e703b7eb403658449be06aec916065009b9154fc479106133a9ec1a5af', '0x000000000000000000000000ff35d8572e3cac8e8d96a24e8dcbfb8e1d1f1ca6']
transactionHash
: 
"0x09016cdf99fb3a11d14bf42f6ad5e15a16e05b16b8779a5b5c23910004c45407"
transactionIndex
: 
2
[[Prototype]]
: 
Object
length
: 
3
[[Prototype]]
: 
Array(0)
logsBloom
: 
"0x00000000000000000000200000000000000000000000000000080000000000000000000000000008000000000000010008000000000000000000000000000000000000020000000000080008000010000000000000000000000000000000000000000000000000000000000010000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000200000401000000000000000000000000000000000000000004000000080000000000000000000000002000000000000000800000000000000000000000000000000000080000000100000000000000000000000000000000000000000000000020000000000"
status
: 
"success"
to
: 
"0x9bad627831cf36c6d9c0e62a37dfd886b9087818"
transactionHash
: 
"0x09016cdf99fb3a11d14bf42f6ad5e15a16e05b16b8779a5b5c23910004c45407"
transactionIndex
: 
2
type
: 
"eip1559"
 */
