import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class FeedEventsService {
  constructor(
    private readonly httpService: HttpService
  ) {
  }

  async handleRecipeFeedUpdates(event: any) {
    console.log('Received comment_created event din service:', event);
    
    const authorId = event.colectie?.utilizator;   
    const servicePath = `${process.env.USER_INTERACTION_URL}/following/followers/${authorId}`;
    const result = await lastValueFrom(this.httpService.get<any>(servicePath));

    console.log("result cu toti followerii lui: ", result.data)
    const followerIds = result.data.map(user => user.id)
  }

}
