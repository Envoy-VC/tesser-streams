import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().min(0).max(65535).default(3000),
    SENTRY_AUTH_TOKEN: z.string(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_PUBLIC_POSTHOG_KEY: z.string(),
    VITE_PUBLIC_POSTHOG_HOST: z.string().url(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
