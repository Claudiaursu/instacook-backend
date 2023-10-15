import { Controller, Get } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserInteractionController {
  constructor(
    private readonly userInteractionService: UserInteractionService,
  ) {}

  @Get()
  getHello(): string {
    return this.userInteractionService.getHello();
  }

  //@Ctx() context: RmqContext
  @EventPattern('notification')
  async handleNotification(@Payload() data: any) {
    this.userInteractionService.notif(data);
  }
}
