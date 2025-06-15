import { filter } from 'convex-helpers/server/filter';
import { z } from 'zod';
import { query } from './helpers';

export const getProfileStatistics = query({
  args: {
    address: z.string(),
  },
  handler: async (ctx, args) => {
    // Collect all vesting schedules for the given address
    const schedules = await ctx.db
      .query('schedules')
      .withIndex('by_beneficiary', (q) => q.eq('beneficiary', args.address))
      .collect();
    const totalCreatedSchedules = schedules.length;

    // Collect all sales with either as buyer or seller
    const sales = await filter(
      ctx.db.query('sales'),
      (s) => s.buyer === args.address || s.seller === args.address
    ).collect();

    const totalVested = schedules.reduce(
      (acc, s) => acc + Number(s.totalAmount),
      0
    );
    const totalTradedSchedules = sales.length;
    const totalTradedVolume = sales.reduce(
      (acc, s) => acc + Number(s.price),
      0
    );

    const totalReleasedAmount = schedules.reduce(
      (acc, s) => acc + Number(s.released),
      0
    );

    return {
      totalVested,
      totalCreatedSchedules,
      totalTradedSchedules,
      totalTradedVolume,
      totalReleasedAmount,
    };
  },
});
