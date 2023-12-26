import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { DatabaseModule } from '@app/common/database/database.module';
import { ContestModule } from './contest/contest.module';
import { CuisineModule } from 'apps/cooking/src/cuisine/cuisine.module';
import { RecipeModule } from 'apps/cooking/src/recipe/recipe.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContestModule,
    CuisineModule,
    RecipeModule
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
