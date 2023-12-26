import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import { RabbitmqModule } from '@app/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { DatabaseModule } from '@app/common/database/database.module';
import { CollectionModule } from './collection/collection.module';
import { RecipeModule } from './recipe/recipe.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { ContestModule } from 'apps/competitions/src/contest/contest.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule.register({
      name: USER_INTERACTION_SERVICE,
    }),
    CollectionModule,
    RecipeModule,
    CuisineModule,
    ContestModule
  ],
  controllers: [CookingController],
  providers: [CookingService],
})
export class CookingModule {}
