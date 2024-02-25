import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionEntity } from '../entities/collection.entity';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CollectionEntity,
     UserEntity,
     RecipeEntity,
     CompetitionEntity
    ]),
  ],
  providers: [
    CollectionService
  ],
  controllers: [CollectionController],
})
export class CollectionModule {}
