import { Module } from '@nestjs/common';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { RabbitmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [  
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
    UserModule
  ],
  controllers: [UserInteractionController],
  providers: [UserInteractionService],
})
export class UserInteractionModule {}
