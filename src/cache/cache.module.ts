import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import UserCacheModule from '../database/redis.database';

@Module({
  imports: [UserCacheModule],
  exports: [CacheService],
  providers: [CacheService],
})
export class CacheModule {}
