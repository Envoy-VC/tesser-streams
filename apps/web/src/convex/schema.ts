import {
  releasesFields,
  scheduleListingFields,
  scheduleSalesFields,
  vestingScheduleFields,
} from '@/lib/zod';
import { zodToConvexFields } from 'convex-helpers/server/zod';
import { defineSchema } from 'convex/server';
import { defineTable } from 'convex/server';

const schema = defineSchema(
  {
    schedules: defineTable(zodToConvexFields(vestingScheduleFields))
      .index('by_vesting_id', ['vestingId'])
      .index('by_beneficiary', ['beneficiary'])
      .index('by_token_id', ['tokenId']),
    listings: defineTable(zodToConvexFields(scheduleListingFields))
      .index('by_seller', ['seller'])
      .index('by_token_id', ['tokenId']),
    sales: defineTable(zodToConvexFields(scheduleSalesFields))
      .index('by_seller', ['seller'])
      .index('by_buyer', ['buyer'])
      .index('by_token_id', ['tokenId']),
    releases: defineTable(zodToConvexFields(releasesFields))
      .index('by_vesting_id', ['vestingId'])
      .index('by_beneficiary', ['beneficiary']),
  },
  {
    strictTableNameTypes: true,
    schemaValidation: true,
  }
);

// biome-ignore lint/style/noDefaultExport: Needed for convex
export default schema;
