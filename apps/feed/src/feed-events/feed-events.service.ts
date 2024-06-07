import { HttpService } from '@nestjs/axios';
//import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RedisRepository } from '../utils/redis.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
//import { Cache } from 'cache-manager';


@Injectable()
export class FeedEventsService {
  constructor(
    private readonly httpService: HttpService,
    //@Inject(CACHE_MANAGER) private cacheManager: Cache
    private readonly redisRepository: RedisRepository
  ) {
  }

  async handleRecipeFeedUpdates(event: any) {
    console.log('Received feed__new_recipe event din service:', event);
    
    const authorId = event.colectie?.utilizator;  
    const recipeId = event.id; 
    const recipeDate = event.createdAt; 
    const servicePath = `${process.env.USER_INTERACTION_URL}/following/followers/${authorId}`;
    
    let result;
    try {

      result = await lastValueFrom(this.httpService.get<any>(servicePath));
    } catch (error) {
      console.log("eroare redis ", error)
    }

    const followerIds = result.data.map(following => following.urmaritor.id)
    console.log("result cu toti followerii lui: ", followerIds)

    let promises = [];
    for (let follower of followerIds) {
      //let prom = this.redisRepository.sadd('user', follower, recipeId);
      let prom = this.redisRepository.zadd('user', follower, new Date(recipeDate).getTime(), recipeId)
      promises.push(prom);
    }

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log(error) 
    }
  
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async cleanupOldEntries() {
      let cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 3);

      const keys = await this.redisRepository.keys('user:*');
      const cleanupPromises = keys.map(key => 
          this.redisRepository.zremrangebyscore('user', key, 0, cutoff.getTime())
      );
      try {
          await Promise.all(cleanupPromises);
          console.log('Old entries cleaned up successfully.');
      } catch (error) {
          console.log('Error during cleanup:', error);
      }
  }

}
