import NumberFlow from '@number-flow/react';

import { api } from '@/convex/_generated/api';
import {
  computeReleasable,
  formatCurrency,
  getScheduleDetails,
} from '@/lib/helpers';
import { wagmiAdapter } from '@/lib/wagmi';
import type { ScheduleListing, VestingSchedule } from '@/lib/zod';
import { TesserStreamsClient } from '@tesser-streams/sdk';
import { Button } from '@tesser-streams/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@tesser-streams/ui/components/dialog';
import { Input } from '@tesser-streams/ui/components/input';
import { useMutation, useQuery } from 'convex/react';
import PlaceholderImage from 'public/images/placeholder.png';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { TesserStreamsLogo } from '../logo';
import { ReleaseScheduleButton } from './release';
import { ReleasesTable } from './releases-table';
import { VestingChart } from './vesting-chart';

interface VestingDetailsProps {
  vestingId: string;
}

export const VestingDetailsContainer = ({
  schedule,
}: { schedule: VestingSchedule }) => {
  const details = useMemo(() => {
    return getScheduleDetails(schedule ?? undefined);
  }, [schedule]);

  const { address } = useAccount();

  const [releasableAmount, setReleasableAmount] = useState(0);

  const listing = useQuery(api.functions.marketplace.getListingForTokenId, {
    tokenId: schedule.tokenId,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      const release = computeReleasable(schedule ?? undefined);
      setReleasableAmount(release);
    }, 1000);
    return () => clearInterval(interval);
  }, [details]);

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
                <NumberFlow
                  value={Number(releasableAmount)}
                  suffix='TES'
                  className='flex items-center gap-2 text-4xl'
                />
              </div>
              <div className='flex justify-end'>
                <ReleaseScheduleButton
                  vestingId={schedule.vestingId}
                  isBeneficiary={schedule.beneficiary === address}
                />
              </div>
            </div>
            <div className='flex h-48 items-center justify-center rounded-b-xl border-r border-b border-l bg-black bg-gradient-to-r from-[rgba(19,17,36,.5)] via-black to-[rgba(19,17,36,.5)] text-center text-[rgb(100,74,238)] text-xl'>
              Vesting Completes in {details.vestingEndsIn}
            </div>
          </div>
        </div>
        <div className='flex w-full basis-2/3 flex-col gap-2'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Total Vesting Amount
              </div>
              <div className='text-2xl'>
                {details.totalAmount.formatted} TES
              </div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Cliff Duration
              </div>
              <div className='text-2xl'>{details.cliffDuration.formatted}</div>
            </div>
            <div className='card-gradient flex flex-col gap-1 rounded-2xl border p-4'>
              <div className='font-medium text-neutral-400 text-sm'>
                Vesting Duration
              </div>
              <div className='text-2xl'>
                {details.vestingDuration.formatted}
              </div>
            </div>
          </div>
          <VestingChart schedule={schedule ?? undefined} />
        </div>
      </div>
      <div className='card-gradient flex w-full flex-cpl flex-col gap-4 rounded-2xl border p-4'>
        <div className='flex w-full flex-col rounded-xl border bg-[#101010] p-3'>
          <div className='text-lg'>Marketplace Listings</div>
        </div>
        <div>
          {listing ? (
            <ActiveListing
              schedule={schedule}
              listing={listing}
            />
          ) : (
            <NoListing schedule={schedule} />
          )}
        </div>
      </div>
      <ReleasesTable vestingId={schedule.vestingId} />
    </div>
  );
};

export const VestingDetails = ({ vestingId }: VestingDetailsProps) => {
  const schedule = useQuery(api.functions.vesting.getVestingSchedule, {
    vestingId,
  });

  if (!schedule) return null;

  return <VestingDetailsContainer schedule={schedule} />;
};

export const ActiveListing = ({
  schedule,
  listing,
}: { schedule: VestingSchedule; listing: ScheduleListing }) => {
  const { address } = useAccount();
  const isBeneficiary = schedule.beneficiary === address;

  const [isLoading, setIsLoading] = useState(false);

  const buyListingMutation = useMutation(
    api.functions.marketplace.buyMarketplaceListing
  );
  const removeListingMutation = useMutation(
    api.functions.marketplace.removeMarketplaceListing
  );

  const onAction = async (action: 'buy' | 'cancel') => {
    try {
      setIsLoading(true);
      if (!address) {
        throw new Error('Connect your wallet');
      }
      const tesser = new TesserStreamsClient(wagmiAdapter.wagmiConfig);
      if (action === 'buy') {
        await tesser.buySchedule({
          tokenId: BigInt(listing.tokenId),
          buyer: address,
        });
        await buyListingMutation({
          tokenId: listing.tokenId,
          buyer: address,
        });
        toast.success('Successfully bought listing');
      } else {
        await tesser.removeScheduleListing({
          tokenId: BigInt(listing.tokenId),
        });
        await removeListingMutation({
          tokenId: listing.tokenId,
        });
        setIsLoading(false);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-row items-center justify-between gap-2 py-4'>
      <div className='flex flex-col gap-2 px-2'>
        <div className='text-neutral-300 text-xs uppercase'>Buy For</div>
        <div className='flex flex-row items-center gap-2'>
          <div className='text-4xl'>
            {formatCurrency(Number(listing.price) / 1e18)}
          </div>
          <div className='flex size-8 items-center justify-center rounded-full bg-primary'>
            <TesserStreamsLogo
              fill='#fff'
              stroke='#fff'
              className='size-5'
            />
          </div>
        </div>
      </div>
      <div>
        {isBeneficiary ? (
          <Button
            onClick={async () => {
              await onAction('cancel');
            }}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Listing'}
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            onClick={async () => {
              await onAction('buy');
            }}
          >
            {isLoading ? 'Buying...' : 'Buy'}
          </Button>
        )}
      </div>
    </div>
  );
};

export const NoListing = ({ schedule }: { schedule: VestingSchedule }) => {
  const { address } = useAccount();
  const isBeneficiary = schedule.beneficiary === address;

  const [amount, setAmount] = useState<string>('0');
  const [isListing, setIsListing] = useState(false);

  const listScheduleMutation = useMutation(
    api.functions.marketplace.createMarketplaceListing
  );

  if (isBeneficiary) {
    return (
      <Dialog>
        <DialogTrigger className='mx-auto w-full p-8'>
          <Button className='!font-medium !rounded-xl'>Create Listing</Button>
        </DialogTrigger>
        <DialogContent className='card-gradient !p-8 !rounded-3xl flex w-[28rem] flex-col gap-4 border'>
          <div className='flex flex-col gap-2'>
            <div className='text-2xl'>Create Listing</div>
            <div className='text-neutral-400 text-sm'>
              Create a listing for your stream to sell on the marketplace.
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-neutral-300'>Price</div>
            <div className='my-4 flex flex-row items-center justify-between rounded-xl border p-2'>
              <Input
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type='number'
                step={1}
                min={0}
                max={100000}
                className='!text-3xl [&::-moz-appearance]:textfield h-12 w-full appearance-none border-none px-0 placeholder:text-3xl placeholder:text-neutral-400 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              />
              <div className='flex max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full border border-neutral-600 bg-primary'>
                <TesserStreamsLogo
                  fill='#fff'
                  stroke='#fff'
                  className='size-5'
                />
              </div>
            </div>
          </div>
          <Button
            className='!font-medium !rounded-xl my-3'
            disabled={isListing}
            onClick={async () => {
              try {
                setIsListing(true);
                if (!address) {
                  throw new Error('Connect your wallet');
                }
                const tesser = new TesserStreamsClient(
                  wagmiAdapter.wagmiConfig
                );
                console.log(schedule);
                const { result } = await tesser.listSchedule({
                  tokenId: BigInt(schedule.tokenId),
                  value: parseEther(amount),
                  owner: address,
                });

                // Update DB With listing
                await listScheduleMutation({
                  ...result,
                  tokenId: result.tokenId.toString(),
                  price: result.price.toString(),
                });
                toast.success('Successfully listed');
                setAmount('');
              } catch (error: unknown) {
                const message =
                  error instanceof Error ? error.message : String(error);
                console.log(error);
                toast.error(message);
              } finally {
                setIsListing(false);
              }
            }}
          >
            {isListing ? 'Listing...' : 'List Schedule'}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className='mx-auto flex flex-col items-center gap-3'>
      {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
      <img
        width={128}
        height={128}
        src={PlaceholderImage}
        alt='Empty State'
      />
    </div>
  );
};
