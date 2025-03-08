import { z } from 'zod';

const ServerConfigSchema = z.object({
  redis: z.object({
    token: z.string(),
    url: z.string(),
  }),
});

export const serverConstants = ServerConfigSchema.parse({
  redis: {
    token:
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  },
});
