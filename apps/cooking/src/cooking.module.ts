import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cooking/.env',
    }),
    // RmqModule.register({
    //   name: BILLING_SERVICE,
    // }),
    // AuthModule,
  ],
  controllers: [CookingController],
  providers: [CookingService],
})
export class CookingModule {}
