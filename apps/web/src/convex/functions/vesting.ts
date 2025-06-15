import { vestingScheduleSchema } from '@/lib/zod';
import { z } from 'zod';
import { mutation, query } from './helpers';

export const createVestingSchedule = mutation({
  args: vestingScheduleSchema,
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('schedules', args);
    return { _id: id, ...args };
  },
});

export const getVestingSchedule = query({
  args: {
    vestingId: z.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('schedules')
      .withIndex('by_vesting_id', (q) => q.eq('vestingId', args.vestingId))
      .first();
    return res;
  },
});

export const updateVestingSchedule = mutation({
  args: {
    updated: vestingScheduleSchema,
  },
  handler: async (ctx, args) => {
    const { updated } = args;
    const schedule = await ctx.db
      .query('schedules')
      .withIndex('by_vesting_id', (q) =>
        q.eq('vestingId', args.updated.vestingId)
      )
      .first();
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    const res = await ctx.db.patch(schedule._id, updated);
    return res;
  },
});

export const getVestingSchedulesForBeneficiary = query({
  args: {
    beneficiary: z.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('schedules')
      .withIndex('by_beneficiary', (q) => q.eq('beneficiary', args.beneficiary))
      .collect();
    return res;
  },
});

export const getVestingSchedulesForTokenId = query({
  args: {
    tokenId: z.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('schedules')
      .withIndex('by_token_id', (q) => q.eq('tokenId', args.tokenId))
      .first();
    return res;
  },
});

export const list = query({
  args: {},
  handler: async (ctx, args) => {
    const res = await ctx.db.query('schedules').take(30);
    return res;
  },
});

export const releaseSchedule = mutation({
  args: {
    vestingId: z.string(),
    amount: z.string(),
    beneficiary: z.string(),
    transactionHash: z.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('releases', args);
  },
});

export const getReleasesForVestingId = query({
  args: {
    vestingId: z.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('releases')
      .withIndex('by_vesting_id', (q) => q.eq('vestingId', args.vestingId))
      .collect();
    return res;
  },
});
