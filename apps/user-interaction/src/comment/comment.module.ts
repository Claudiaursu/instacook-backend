import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { CommentEntity } from '../entities/comment.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { UrmarireEntity } from '../entities/urmarire.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     RecipeEntity,
     CuisineEntity,
     UrmarireEntity
    ]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
