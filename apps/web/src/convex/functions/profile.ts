import { filter } from 'convex-helpers/server/filter';
import { z } from 'zod';
import { query } from './helpers';

export const getProfileStatistics = query({
  args: {
    address: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  },
  handler: async (ctx, args) => {
    // Collect all vesting schedules for the given address
    const schedules = await ctx.db
      .query('schedules')
      .withIndex('by_beneficiary', (q) => q.eq('beneficiary', args.address))
      .collect();

    // Collect all sales with either as buyer or seller
    const sales = await filter(
      ctx.db.query('sales'),
      (s) => s.buyer === args.address || s.seller === args.address
    ).collect();

    const totalVested = schedules.reduce((acc, s) => acc + s.totalAmount, 0n);
    const totalTradedSchedules = sales.length;
    const totalTradedVolume = sales.reduce((acc, s) => acc + s.price, 0n);

    return {
      totalVested,
      totalTradedSchedules,
      totalTradedVolume,
    };
  },
});
