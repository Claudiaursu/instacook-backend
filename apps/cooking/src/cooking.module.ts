import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import { RabbitmqModule } from '@app/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cooking/.env',
    }),
    RabbitmqModule.register({
      name: USER_INTERACTION_SERVICE,
    }),
    // AuthModule,
  ],
  controllers: [CookingController],
  providers: [CookingService],
})
export class CookingModule {}
