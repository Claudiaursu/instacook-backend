import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CompetitionEntity } from '../entities/competition.entity';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CuisineEntity,
     CompetitionEntity,
     RecipeEntity,
     CommentEntity,
     CollectionEntity,
     UserEntity,
     UrmarireEntity,
     NotificationEntity
    ]),
  ],
  providers: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
