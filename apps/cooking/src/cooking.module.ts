import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import { RabbitmqModule } from '@app/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    DatabaseModule.register({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD
    }),
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
