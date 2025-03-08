import { z } from 'zod';

const ServerConfigSchema = z.object({
  redis: z.object({
    retries: z.number(),
    token: z.string(),
    url: z.string(),
  }),
});

export const serverConstants = ServerConfigSchema.parse({
  redis: {
    retries: parseInt(process.env.REDIS_RETRIES ?? '0', 10),
    token:
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  },
});
