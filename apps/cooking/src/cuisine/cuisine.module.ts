import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CollectionEntity } from '../entities/collection.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { CuisineEntity } from '../entities/cuisine.entity';
import { CuisineController } from './cuisine.controller';
import { CuisineService } from './cuisine.service';
import { ContestModule } from 'apps/competitions/src/contest/contest.module';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CollectionEntity,
     RecipeEntity,
     CuisineEntity,
     CompetitionEntity,
     UrmarireEntity,
     NotificationEntity
    ]),
  ],
  providers: [CuisineService],
  controllers: [CuisineController],
})
export class CuisineModule {}
