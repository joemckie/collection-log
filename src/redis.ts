import { Redis, RedisConfigNodejs } from '@upstash/redis';
import { serverConstants } from './config/constants.server';

const redisConfig = {
  keepAlive: false,
  retry: {
    retries: parseInt(process.env.REDIS_RETRIES ?? '0', 10),
  },
} satisfies Omit<RedisConfigNodejs, 'url' | 'token'>;

export const redis = new Redis({
  ...redisConfig,
  url: serverConstants.redis.url,
  token: serverConstants.redis.token,
});
