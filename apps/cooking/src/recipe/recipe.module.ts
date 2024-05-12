import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { CollectionEntity } from '../entities/collection.entity';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';
import { CuisineEntity } from '../entities/cuisine.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { CollectionService } from '../collection/collection.service';
import { ReactionEntity } from 'apps/user-interaction/src/entities/reaction.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CollectionEntity,
     RecipeEntity,
     CommentEntity,
     CuisineEntity,
     CompetitionEntity,
     UrmarireEntity,
     ReactionEntity
    ]),
  ],
  providers: [RecipeService, CollectionService],
  controllers: [RecipeController],
})
export class RecipeModule {}
