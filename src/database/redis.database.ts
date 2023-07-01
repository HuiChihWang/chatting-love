import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { ConfigService } from '@nestjs/config';

const UserCacheModule = CacheModule.registerAsync<RedisClientOptions>({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_DATABASE_HOST');
    const port = configService.get<number>('REDIS_DATABASE_PORT');

    return {
      isGlobal: true,
      store: redisStore,
      url: `redis://${host}:${port}`,
      ttl: 86400 * 1000 * configService.get<number>('REDIS_CACHE_TTL_DAY'),
    };
  },
});

export default UserCacheModule;
