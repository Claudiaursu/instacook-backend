import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { ReactionEntity } from 'apps/user-interaction/src/entities/reaction.entity';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     UrmarireEntity,
     ReactionEntity,
     NotificationEntity,
     RecipeEntity,
     CuisineEntity,
     CompetitionEntity
    ])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
