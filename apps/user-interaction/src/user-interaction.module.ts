import { Module } from '@nestjs/common';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { RabbitmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
  ],
  controllers: [UserInteractionController],
  providers: [UserInteractionService],
})
export class UserInteractionModule {}
