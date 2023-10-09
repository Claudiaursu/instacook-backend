import { Controller, Get } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';

@Controller()
export class UserInteractionController {
  constructor(private readonly userInteractionService: UserInteractionService) {}

  @Get()
  getHello(): string {
    return this.userInteractionService.getHello();
  }
}
