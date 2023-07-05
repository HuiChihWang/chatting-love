import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    const cachedObject = (await this.cacheManager.get<T>(key)) || {};
    return cachedObject as T;
  }

  async put<T>(key: string, value: T) {
    await this.cacheManager.set(key, value);
  }
}
