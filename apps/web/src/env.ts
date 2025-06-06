import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().min(0).max(65535).default(3000),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_REOWN_PROJECT_ID: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
