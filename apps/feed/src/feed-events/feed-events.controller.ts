import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FeedEventsService } from './feed-events.service';

@ApiTags('Feed Events')
@Controller()
export class FeedEventsController {
  constructor(
    private readonly feedEventsService: FeedEventsService,
  ) { }

  @EventPattern('feed__new_recipe')
  async handleNewRecipe(@Payload() data: any) {
    console.log('Received feed__new_recipe event din controller', data);
    return this.feedEventsService.handleRecipeFeedUpdates(data);
  }
}
