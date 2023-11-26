import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CollectionEntity } from '../entities/collection.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { CuisineEntity } from '../entities/cuisine.entity';
import { CuisineController } from './cuisine.controller';
import { CuisineService } from './cuisine.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CollectionEntity,
     RecipeEntity,
     CuisineEntity
    ]),
  ],
  providers: [CuisineService],
  controllers: [CuisineController],
})
export class CuisineModule {}
