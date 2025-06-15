import z from 'zod';

export const vestingScheduleFields = {
  beneficiary: z.string().regex(/^0x[0-9a-fA-F]{40}$/), // Ethereum address
  tokenAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  vestingId: z.string().regex(/^0x[0-9a-fA-F]{66}$/),
  startTime: z.number(),
  cliffDuration: z.number(),
  vestingDuration: z.number(),
  alpha: z.bigint(),
  totalAmount: z.bigint(),
  released: z.bigint(),
  accountAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  tokenId: z.bigint(),
  frozen: z.boolean(),
};
export const vestingScheduleSchema = z.object(vestingScheduleFields);

export type VestingSchedule = z.infer<typeof vestingScheduleSchema>;

export const scheduleListingFields = {
  seller: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  nftContract: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  tokenId: z.bigint(),
  price: z.bigint(),
};

export const scheduleListingSchema = z.object(scheduleListingFields);

export type ScheduleListing = z.infer<typeof scheduleListingSchema>;

export const scheduleSalesFields = {
  seller: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  buyer: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  nftContract: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  tokenId: z.bigint(),
  price: z.bigint(),
};

export const scheduleSalesSchema = z.object(scheduleSalesFields);

export type ScheduleSales = z.infer<typeof scheduleSalesSchema>;

export const releasesFields = {
  vestingId: z.string().regex(/^0x[0-9a-fA-F]{66}$/),
  beneficiary: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  amount: z.bigint(),
  transactionHash: z.string(),
};

export const releaseSchema = z.object(releasesFields);

export type Release = z.infer<typeof releaseSchema>;
