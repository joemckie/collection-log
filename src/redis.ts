import { Redis, RedisConfigNodejs } from '@upstash/redis';
import { serverConstants } from './config/constants.server';

const redisConfig = {
  keepAlive: false,
  retry: {
    retries: serverConstants.redis.retries,
  },
} satisfies Omit<RedisConfigNodejs, 'url' | 'token'>;

export const redis = Redis.fromEnv(redisConfig);
