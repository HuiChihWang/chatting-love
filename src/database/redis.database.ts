import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

const UserCacheModule = CacheModule.register<RedisClientOptions>({
  isGlobal: true,
  store: redisStore,
  url: 'redis://localhost:6379',
  ttl: 86400 * 1000,
});

export default UserCacheModule;
