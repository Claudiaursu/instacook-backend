import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { ReactionController } from './reaction.controller';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { CommentEntity } from '../entities/comment.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { UrmarireEntity } from '../entities/urmarire.entity';
import { ReactionService } from './reaction.service';
import { ReactionEntity } from '../entities/reaction.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     RecipeEntity,
     CuisineEntity,
     UrmarireEntity,
     ReactionEntity,
     NotificationEntity
    ]),
  ],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
