import z from 'zod';

export const vestingScheduleFields = {
  beneficiary: z.string(), // Ethereum address
  tokenAddress: z.string(),
  vestingId: z.string(),
  startTime: z.number(),
  cliffDuration: z.number(),
  vestingDuration: z.number(),
  alpha: z.string(),
  totalAmount: z.string(),
  released: z.string(),
  accountAddress: z.string(),
  tokenId: z.string(),
  frozen: z.boolean(),
};
export const vestingScheduleSchema = z.object(vestingScheduleFields);

export type VestingSchedule = z.infer<typeof vestingScheduleSchema>;

export const scheduleListingFields = {
  seller: z.string(),
  nftContract: z.string(),
  tokenId: z.string(),
  price: z.string(),
};

export const scheduleListingSchema = z.object(scheduleListingFields);

export type ScheduleListing = z.infer<typeof scheduleListingSchema>;

export const scheduleSalesFields = {
  seller: z.string(),
  buyer: z.string(),
  nftContract: z.string(),
  tokenId: z.string(),
  price: z.string(),
};

export const scheduleSalesSchema = z.object(scheduleSalesFields);

export type ScheduleSales = z.infer<typeof scheduleSalesSchema>;

export const releasesFields = {
  vestingId: z.string(),
  beneficiary: z.string(),
  amount: z.string(),
  transactionHash: z.string(),
};

export const releaseSchema = z.object(releasesFields);

export type Release = z.infer<typeof releaseSchema>;
