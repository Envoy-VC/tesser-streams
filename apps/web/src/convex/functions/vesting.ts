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
    vestingId: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('schedules')
      .withIndex('by_vesting_id', (q) => q.eq('vestingId', args.vestingId))
      .first();
    return res;
  },
});

export const getVestingSchedulesForBeneficiary = query({
  args: {
    beneficiary: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('schedules')
      .withIndex('by_beneficiary', (q) => q.eq('beneficiary', args.beneficiary))
      .first();
    return res;
  },
});

export const getVestingSchedulesForTokenId = query({
  args: {
    tokenId: z.bigint(),
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
