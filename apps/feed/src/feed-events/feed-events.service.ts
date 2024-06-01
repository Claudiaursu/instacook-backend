import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class FeedEventsService {
  constructor(
    //private readonly httpService: HttpService
  ) {
  }

  async handleRecipeFeedUpdates(event: any) {
    console.log('Received comment_created event din service:', event);
    
  }

}
