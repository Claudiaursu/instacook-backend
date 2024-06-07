import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

//import { RedisRepositoryInterface } from '../../../domain/interface/redis.repository.interface';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }

    async sadd(prefix: string, key: string, ...members: string[]): Promise<void> {
      await this.redisClient.sadd(`${prefix}:${key}`, ...members);
    }
    async smembers(prefix: string, key: string): Promise<string[]> {
      return this.redisClient.smembers(`${prefix}:${key}`);
    }

    async zadd(prefix: string, key: string, score: string, member: string): Promise<void> {
      await this.redisClient.zadd(`${prefix}:${key}`, score, member);
    } 
  
    async zrangebyscore(prefix: string, key: string, start: number, stop: number): Promise<string[]> {
      return this.redisClient.zrangebyscore(`${prefix}:${key}`, start, stop);
    }
  
}