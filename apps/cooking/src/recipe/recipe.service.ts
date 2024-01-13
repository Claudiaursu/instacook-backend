import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { RecipeEntity } from '../entities/recipe.entity';
import { logger } from '@app/common/logger';

@Injectable()
export class RecipeService extends TypeOrmBaseService<RecipeEntity> {
  constructor(
    @InjectRepository(RecipeEntity)
    protected readonly recipeRepo: Repository<RecipeEntity>,
  ) {
    super();
  }

  getAllRecipes = async (): Promise<RecipeEntity[]> => {
    const recipes = await this.recipeRepo.find({
      order: {
        titluReteta: 'ASC'
      },
      relations:[
        'colectie'
      ]
    });
    return Promise.resolve(recipes);
  };

  getRecipesForCollection = async (colectieId: string): Promise<RecipeEntity[]> => {
    const colectieID = parseInt(colectieId);

    const recipes = await this.recipeRepo.find({
      where: {
        colectie: {
          id: colectieID
        }
      },
    });
    return Promise.resolve(recipes);
  };

  getRecipeById = async (recipeId: string): Promise<RecipeEntity> => {
    try {
      const recipe = await this.recipeRepo.findOne({
        where: {
          id: parseInt(recipeId),
          deletedAt: null
        },
      });
      return recipe;

    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find recipe with id ${recipeId}`, { error });
    }
  };

  createRecipe = async (recipe: RecipeEntity): Promise<RecipeEntity> => {
    const recipeObject = this.recipeRepo.create(recipe);

    try {
      await this.recipeRepo.insert(recipeObject);
      return recipeObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new recipe: ${JSON.stringify(error)}`, { error });
    }
  };

  updateRecipe = async (recipeId: string, recipe: RecipeEntity): Promise<any> => {
    const existingObject = await this.recipeRepo.findOne({
      where: {
        id: parseInt(recipeId)
      }
    });

    try {
      if (existingObject) {
        const updatedResult = await this.recipeRepo.update(parseInt(recipeId), recipe);
        return updatedResult;
      }

    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any recipe with id ${recipeId}`);
    }
  }

  deleteRecipe = async (recipeId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.recipeRepo.delete(recipeId);
      return deleteResult;

    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete recipe: ${JSON.stringify(error)}`);
    }
  };
}
