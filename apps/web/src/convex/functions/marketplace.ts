import { scheduleListingSchema } from '@/lib/zod';
import { z } from 'zod';
import { mutation, query } from './helpers';

export const createMarketplaceListing = mutation({
  args: scheduleListingSchema,
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('listings', args);
    return { _id: id, ...args };
  },
});

export const removeMarketplaceListing = mutation({
  args: {
    tokenId: z.bigint(),
  },
  handler: async (ctx, args) => {
    // Check if listing exists
    const listing = await ctx.db
      .query('listings')
      .withIndex('by_token_id', (q) => q.eq('tokenId', args.tokenId))
      .first();

    if (!listing) {
      throw new Error('Listing not found');
    }

    await ctx.db.delete(listing._id);
    return listing;
  },
});

export const list = query({
  args: {},
  handler: async (ctx, args) => {
    const res = await ctx.db.query('listings').take(30);
    return res;
  },
});

export const buyMarketplaceListing = mutation({
  args: {
    tokenId: z.bigint(),
    buyer: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  },
  handler: async (ctx, args) => {
    // Check if listing exists
    const listing = await ctx.db
      .query('listings')
      .withIndex('by_token_id', (q) => q.eq('tokenId', args.tokenId))
      .first();

    if (!listing) {
      throw new Error('Listing not found');
    }

    // remove listing
    await ctx.db.delete(listing._id);

    // add sale
    const sale = {
      seller: listing.seller,
      buyer: args.buyer,
      nftContract: listing.nftContract,
      tokenId: listing.tokenId,
      price: listing.price,
    };

    // Update beneficiary in vesting schedule
    const vestingSchedule = await ctx.db
      .query('schedules')
      .withIndex('by_token_id', (q) => q.eq('tokenId', listing.tokenId))
      .first();

    if (vestingSchedule) {
      await ctx.db.patch(vestingSchedule._id, {
        beneficiary: args.buyer,
      });
    }

    const id = await ctx.db.insert('sales', sale);
    return { _id: id, ...sale };
  },
});
