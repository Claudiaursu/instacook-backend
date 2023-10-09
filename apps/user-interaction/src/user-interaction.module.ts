import { Module } from '@nestjs/common';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';

@Module({
  imports: [],
  controllers: [UserInteractionController],
  providers: [UserInteractionService],
})
export class UserInteractionModule {}
