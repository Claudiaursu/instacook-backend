import { Module } from '@nestjs/common';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';

@Module({
  imports: [],
  controllers: [CookingController],
  providers: [CookingService],
})
export class CookingModule {}
