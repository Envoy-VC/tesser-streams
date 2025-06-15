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

import { api } from '@/convex/_generated/api';
import { getDuration } from '@/lib/helpers';
import { Contracts, wagmiAdapter } from '@/lib/wagmi';
import { TesserStreamsClient } from '@tesser-streams/sdk';
import { Input } from '@tesser-streams/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tesser-streams/ui/components/select';
import { useMutation } from 'convex/react';
import { CirclePlusIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
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
  const { address } = useAccount();

  const [isCreating, setIsCreating] = useState(false);

  const createScheduleMutation = useMutation(
    api.functions.vesting.createVestingSchedule
  );

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

      const tesser = new TesserStreamsClient(wagmiAdapter.wagmiConfig);
      const allowance = await tesser.getTokenAllowance({
        owner: address,
        spender: Contracts.token.address,
      });

      const needsApproval = allowance < value;

      if (needsApproval) {
        await tesser.approveToken({
          spender: Contracts.tesserProxy.address,
          value: value,
        });
      }

      const { result } = await tesser.createVestingSchedule({
        beneficiary: values.beneficiary as `0x${string}`,
        tokenAddress: Contracts.token.address,
        totalAmount: value,
        cliffDuration,
        vestingDuration,
        alpha: parseEther(values.alpha.toString()),
      });

      await createScheduleMutation(result);

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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
