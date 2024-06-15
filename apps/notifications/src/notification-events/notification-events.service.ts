import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { logger } from '@app/common/logger';
import { NotificationEntity } from '../entities/notification.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../notification/notification.service';
import { plainToClass } from 'class-transformer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotificationEventsService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly httpService: HttpService
  ) {
  }

  async handleFollowCreated(event: any) {
    console.log('Received like_created event din service:', event);
    const source = event.data.urmaritor.username;
    const destination = event.data.urmarit.id;
    const notificationMessage = `${source} started following you`;

    const newNotification = {
      text: notificationMessage,
      info: "",
      categorie: 'follow',
      citita: false,
      utilizator: {
        id: destination
      }
    }

    const notificationClass = plainToClass(NotificationEntity, newNotification);
    this.notificationService.createNotification(notificationClass);
  }

  async handleLikeCreated(event: any) {
    console.log('Received like_created event din service:', event);
    const likeAuthor = event.data.utilizator.username;
    const recipe = event.data.reteta.titluReteta;
    const recipeId = event.data.reteta.id;

    if (!recipe || !likeAuthor) {
      return;
    }

    const notificationMessage = `${likeAuthor} liked your recipe: ${recipe}`;
    
    const servicePath = `${process.env.COOKING_URL}/owner/${recipeId}`;
    const result = await lastValueFrom(this.httpService.get<any>(servicePath));
    const ownerId = result.data?.ownerId;

    const newNotification = {
      text: notificationMessage,
      info: "",
      categorie: 'like',
      citita: false,
      utilizator: {
        id: ownerId
      }
    }

    //we don't store& send notification for an action of the user on its own recipe 
    if (ownerId === likeAuthor) {
      return;
    }
    const notificationClass = plainToClass(NotificationEntity, newNotification);
    this.notificationService.createNotification(notificationClass);
  }

  async handleCommentCreated(event: any) {
    console.log('Received comment_created event din service:', event);
    const commentAuthor = event.data.utilizator.username;
    const recipe = event.data.reteta.titluReteta;
    const recipeId = event.data.reteta.id;
    const notificationMessage = `${commentAuthor} commented on your recipe: ${recipe}`;
    
    const servicePath = `${process.env.COOKING_URL}/owner/${recipeId}`;
    const result = await lastValueFrom(this.httpService.get<any>(servicePath));
    const ownerId = result.data?.ownerId;

    const newNotification = {
      text: notificationMessage,
      info: event.data.text,
      categorie: 'comentariu',
      citita: false,
      utilizator: {
        id: ownerId
      }
    }

    //we don't store& send notification for an action of the user on its own recipe 
    if (ownerId === commentAuthor) {
      return;
    }
    const notificationClass = plainToClass(NotificationEntity, newNotification);
    this.notificationService.createNotification(notificationClass);
  }


  // getAllRecipes = async (): Promise<RecipeEntity[]> => {
  //   const recipes = await this.recipeRepo.find({
  //     order: {
  //       titluReteta: 'ASC'
  //     },
  //     relations:[
  //       'colectie'
  //     ]
  //   });
  //   return Promise.resolve(recipes);
  // };

  // getRecipesForCollection = async (colectieId: string): Promise<RecipeEntity[]> => {
  //   const colectieID = parseInt(colectieId);
  
  //   // const recipesWithReactionCount = await this.recipeRepo.createQueryBuilder('reteta')
  //   //   .leftJoin('reteta.reactii', 'reactie_reteta')
  //   //   .select(['reteta', 'COUNT(reactie_reteta.id) as reactii'])
  //   //   .where('reteta.colectie.id = :colectieID', { colectieID })
  //   //   .groupBy('reteta.id')
  //   //   .getRawMany();

  //   const recipesWithReactionCount = await this.recipeRepo.createQueryBuilder('reteta')
  //   .leftJoin('reteta.reactii', 'reactie_reteta')
  //   .leftJoin('reteta.comentarii', 'comentariu')
  //   .select([
  //     'reteta.id as id',
  //     'reteta.created_at as createdAt',
  //     'reteta.updated_at as updatedAt',
  //     'reteta.titlu_reteta as titluReteta',
  //     'reteta.dificultate as dificultate',
  //     'reteta.ingrediente as ingrediente',
  //     'reteta.instructiuni as instructiuni',
  //     'reteta.cale_poza as calePoza',
  //     'reteta.cale_video as caleVideo',
  //     'reteta.participa_concurs as participaConcurs',
  //     'reteta.deleted_at as deletedAt',
  //     'COUNT(reactie_reteta.id) as reactii',
  //     'COUNT(comentariu.id) as comentarii'
  //   ])
  //   .where('reteta.colectie.id = :colectieID', { colectieID })
  //   .groupBy('reteta.id')
  //   .getRawMany();

  //   return Promise.resolve(recipesWithReactionCount);

  // };

  // getRecipesForUser = async (userId: string): Promise<RecipeEntity[]> => {
  //   const collections = await this.collectionService.getCollectionsForUser(userId);
  //   const collection_ids = collections.map(col => col.id);

  //   console.log("IDS ", collection_ids)

  //   let recipes;
  //   try {
  //     recipes = await this.recipeRepo
  //     .createQueryBuilder('recipe')
  //     .leftJoinAndSelect('recipe.colectie', 'colectie') 
  //     .where('colectie.id IN (:...ids)', { ids: collection_ids })
  //     .getMany();

  //     console.log("REZULTAT ", recipes )

  //   } catch (error) {
  //     console.log(error)
  //   }
  //   return Promise.resolve(recipes);
  // };

  // getPublicRecipesForUser = async (userId: string): Promise<RecipeEntity[]> => {
  //   const collections = await this.collectionService.getCollectionsForUser(userId);
  //   const collection_ids = collections.map(col => col.id);

  //   console.log("IDS ", collection_ids)

  //   let recipes;
  //   try {
  //     recipes = await this.recipeRepo
  //     .createQueryBuilder('recipe')
  //     .leftJoinAndSelect('recipe.colectie', 'colectie') 
  //     .where('colectie.id IN (:...ids)', { ids: collection_ids })
  //     .andWhere('colectie.publica = true')  
  //     .getMany();

  //     console.log("REZULTAT ", recipes )

  //   } catch (error) {
  //     console.log(error)
  //   }
  //   return Promise.resolve(recipes);
  // };

  // getRecipeById = async (recipeId: string): Promise<RecipeEntity> => {
  //   try {
  //     const recipe = await this.recipeRepo
  //     .createQueryBuilder('recipe')
  //     .leftJoinAndSelect('recipe.reactii', 'reactii')
  //     .leftJoin('reactii.utilizator', 'utilizator')
  //     .addSelect(['utilizator.id'])
  //     .leftJoinAndSelect('recipe.comentarii', 'comentarii')
  //     .leftJoin('comentarii.utilizator', 'autor')
  //     .addSelect(['autor.username', 'autor.pozaProfil', 'autor.id'])
  //     .where('recipe.id = :recipeId', { recipeId: parseInt(recipeId) })
  //     .andWhere('recipe.deletedAt IS NULL')
  //     .getOne();

  //     return recipe;

  //   } catch (error) {
  //     logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find recipe with id ${recipeId}`, { error });
  //   }
  // };

  // createRecipe = async (recipe: RecipeEntity): Promise<RecipeEntity> => {
  //   const recipeObject = this.recipeRepo.create(recipe);

  //   try {
  //     await this.recipeRepo.insert(recipeObject);
  //     return recipeObject;
  //   } catch (error) {
  //     logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new recipe: ${JSON.stringify(error)}`, { error });
  //   }
  // };

  // updateRecipe = async (recipeId: string, recipe: RecipeEntity): Promise<any> => {
  //   const existingObject = await this.recipeRepo.findOne({
  //     where: {
  //       id: parseInt(recipeId)
  //     }
  //   });

  //   try {
  //     if (existingObject) {
  //       const updatedResult = await this.recipeRepo.update(parseInt(recipeId), recipe);
  //       return updatedResult;
  //     }

  //   } catch (error) {
  //     logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any recipe with id ${recipeId}`);
  //   }
  // }

  // deleteRecipe = async (recipeId: number): Promise<DeleteResult> => {
  //   try {
  //     const deleteResult = await this.recipeRepo.delete(recipeId);
  //     return deleteResult;

  //   } catch (error) {
  //     logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete recipe: ${JSON.stringify(error)}`);
  //   }
  // };
}
