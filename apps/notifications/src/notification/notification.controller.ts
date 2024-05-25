import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { NotificationService } from './notification.service';
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';

@ApiTags('Notifications')
@Controller('v1/notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  // @Get('')
  // @ApiOperation({ summary: 'Get all recipes' })
  // async findAllRecipes(): Promise<RecipeEntity[]> {
  //   try {
  //     const allRecipes = await this.recipeService.getAllRecipes();
  //     return allRecipes;

  //   } catch (error) {
  //     logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all recipes`, { error })
  //     return error;
  //   }
  // }

  // @Get('/users/:userId')
  // @ApiParam({
  //   name: 'userId',
  //   type: 'string',
  //   schema: {
  //     example: '1',
  //   },
  // })
  // @ApiOperation({ summary: 'Get all recipes for user' })
  // async findRecipesForUser(@Param('userId') userId: string): Promise<RecipeEntity[] | null> {
  //   try {
  //     const allRecipesForUser = await this.recipeService.getRecipesForUser(userId);
  //     return allRecipesForUser;
      
  //   } catch (error) {
  //     logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all recipes for user`, { error })
  //     return error;
  //   }
  // }


  // @Get('/users/public/:userId')
  // @ApiParam({
  //   name: 'userId',
  //   type: 'string',
  //   schema: {
  //     example: '1',
  //   },
  // })
  // @ApiOperation({ summary: 'Get all public recipes for user' })
  // async findPublicRecipesForUser(@Param('userId') userId: string): Promise<RecipeEntity[] | null> {
  //   try {
  //     const allRecipesForUser = await this.recipeService.getPublicRecipesForUser(userId);
  //     return allRecipesForUser;
      
  //   } catch (error) {
  //     logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all public recipes for user`, { error })
  //     return error;
  //   }
  // }

  // @Get('/:recipeId')
  // @ApiParam({
  //   name: 'recipeId',
  //   type: 'string',
  //   schema: {
  //     example: '1',
  //   },
  // })
  // @ApiOperation({ summary: 'Get a recipe by its id' })
  // async findRecipe(@Param('recipeId') recipeId: string): Promise<RecipeEntity | null> {
  //   try {
  //     const recipe = await this.recipeService.getRecipeById(recipeId);
  //     // recipe.reactii = recipe.reactii.map((reactie) => ({
  //     //   utilizator: {
  //     //     id: reactie.utilizator.id,
  //     //   },
  //     // }));
  //     return recipe;

  //   } catch (error) {
  //     logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find recipe with id ${recipeId}`)
  //     return error;
  //   }
  // }

  // @Get('/collection/:collectionId')
  // @ApiParam({
  //   name: 'collectionId',
  //   type: 'string',
  //   schema: {
  //     example: '1',
  //   },
  // })
  // @ApiOperation({ summary: 'Get all recipes by collection id' })
  // async getRecipesByCollection(@Param('collectionId') collectionId: string): Promise<RecipeEntity[] | null> {
  //   try {
  //     const recipes = await this.recipeService.getRecipesForCollection(collectionId);
  //     return recipes;

  //   } catch (error) {
  //     console.log("ERROR< ", error)
  //     logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find recipes for collection ${collectionId}`)
  //     return error;
  //   }
  // }

  // @Post('')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       recipeTitle: 'Chocolate Cake',
  //       difficulty: 'Medium',
  //       ingredients: ['chocolate', 'flour', 'sugar'],
  //       instructions: 'Bake the cake at 350 degrees for 30 minutes.',
  //     },
  //   },
  // })
  // @ApiOperation({ summary: 'Create a new recipe' })
  // async createRecipe(@Body() recipe: RecipeEntity, @Res() res: Response) {
  //   try {
  //     recipe.participaConcurs = recipe.participaConcurs ?? false;

  //     const recipeClass = plainToClass(RecipeEntity, recipe);
  //     const createdObject = await this.recipeService.createRecipe(recipeClass);
  //     res = res.json(createdObject);
  //     return res;

  //   } catch (error) {
  //     res.status(500).send(`Could not create new recipe: ${error}`);
  //     logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create recipe`, { error })
  //   }
  // }

  // @Patch(':recipeId')
  // @ApiOperation({ summary: 'Update a recipe' })
  // @ApiParam({
  //   name: 'recipeId',
  //   type: 'string',
  //   schema: {
  //     default: '1',
  //   },
  // })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       recipeTitle: 'Chocolate Cake',
  //       difficulty: 'Hard',
  //       ingredients: ['chocolate', 'flour', 'sugar'],
  //       instructions: 'Bake the cake at 375 degrees for 40 minutes.',
  //     }
  //   },
  // })
  // async updateRecipe(@Body() recipe: RecipeEntity, @Param('recipeId') recipeId: string, @Res() res: Response) {
  //   try {
  //     const updatedObject = await this.recipeService.updateRecipe(recipeId, recipe);
  //     res = res.json(updatedObject);
  //     return res;

  //   } catch (error) {
  //     logger.throw("01J4GH5S7R38W2K9FV1DZW4Q9P", `Could not update recipe with id ${recipeId}`, { error })
  //   }
  // }

  // @Delete('/:recipeId')
  // @ApiOperation({ summary: 'Deletes a recipe by id' })
  // @ApiParam({
  //   name: 'recipeId',
  //   type: 'string',
  //   schema: {
  //     default: '1',
  //   },
  // })
  // async deleteRecipe(@Param('recipeId') recipeId: string): Promise<DeleteResult> {
  //   try {
  //     const deleteResult = await this.recipeService.deleteRecipe(parseInt(recipeId));
  //     return deleteResult;
  //   } catch (error) {
  //     logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not delete recipe with id ${recipeId}`, { error })
  //   }
  // }
}
