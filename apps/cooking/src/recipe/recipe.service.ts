import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository, getManager } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { RecipeEntity } from '../entities/recipe.entity';
import { logger } from '@app/common/logger';
import { CollectionService } from '../collection/collection.service';
import { RecipeViewEntity } from '../entities/recipe-view.entity';
import { ClientProxy } from '@nestjs/microservices';
import { RedisRepository } from '../utils/redis.repository';

@Injectable()
export class RecipeService extends TypeOrmBaseService<RecipeEntity> {
  constructor(
    @InjectRepository(RecipeEntity)
    protected readonly recipeRepo: Repository<RecipeEntity>,
    private readonly collectionService: CollectionService,
    @InjectEntityManager()
    private entityManager: EntityManager,
    @Inject("USER_INTERACTION")
    private readonly rabbitmqService: ClientProxy, 
    private readonly redisRepository: RedisRepository

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


  getOwnerOfTheRecipe = async (recipeId: string): Promise<any> => {
    const recipe = await this.recipeRepo
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.colectie', 'colectie')
    .leftJoin('colectie.utilizator', 'utilizator')
    .addSelect(['utilizator.id'])
    .where('recipe.id = :recipeId', { recipeId: parseInt(recipeId) })
    .andWhere('recipe.deletedAt IS NULL')
    .getOne();

    const ownerId = recipe.colectie.utilizator.id;
    return Promise.resolve(ownerId);
  };

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

  getRecipesForCollection = async (colectieId: string): Promise<RecipeEntity[]> => {
    const colectieID = parseInt(colectieId);

    const recipesWithReactionCount = await this.recipeRepo.createQueryBuilder('reteta')
        .leftJoin('reteta.reactii', 'reactie_reteta')
        .leftJoin('reteta.comentarii', 'comentariu')
        .select([
            'reteta.id as id',
            'reteta.created_at as createdAt',
            'reteta.updated_at as updatedAt',
            'reteta.titlu_reteta as titluReteta',
            'reteta.dificultate as dificultate',
            'reteta.ingrediente as ingrediente',
            'reteta.instructiuni as instructiuni',
            'reteta.cale_poza as calePoza',
            'reteta.cale_video as caleVideo',
            'reteta.participa_concurs as participaConcurs',
            'reteta.deleted_at as deletedAt',
            '(SELECT COUNT(reactie_reteta.id) FROM reactie_reteta WHERE reactie_reteta.reteta_id = reteta.id) as reactii',
            '(SELECT COUNT(comentariu.id) FROM comentariu WHERE comentariu.reteta_id = reteta.id) as comentarii'
        ])
        .where('reteta.colectie.id = :colectieID', { colectieID })
        .groupBy('reteta.id')
        .getRawMany();

    return Promise.resolve(recipesWithReactionCount);
};

  getRecipesForUser = async (userId: string): Promise<RecipeEntity[]> => {
    const collections = await this.collectionService.getCollectionsForUser(userId);
    const collection_ids = collections.map(col => col.id);

    console.log("IDS ", collection_ids)

    let recipes;
    try {
      recipes = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.colectie', 'colectie') 
      .where('colectie.id IN (:...ids)', { ids: collection_ids })
      .getMany();

      console.log("REZULTAT ", recipes )

    } catch (error) {
      console.log(error)
    }
    return Promise.resolve(recipes);
  };

  getPublicRecipesForUser = async (userId: string): Promise<RecipeEntity[]> => {
    const collections = await this.collectionService.getCollectionsForUser(userId);
    const collection_ids = collections.map(col => col.id);

    console.log("IDS ", collection_ids)

    let recipes;
    try {
      recipes = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.colectie', 'colectie') 
      .where('colectie.id IN (:...ids)', { ids: collection_ids })
      .andWhere('colectie.publica = true')  
      .getMany();

      console.log("REZULTAT ", recipes )

    } catch (error) {
      console.log(error)
    }
    return Promise.resolve(recipes);
  };

  getRecipeById = async (recipeId: string): Promise<RecipeEntity> => {
    try {
      const recipe = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.reactii', 'reactii')
      .leftJoin('reactii.utilizator', 'utilizator')
      .addSelect(['utilizator.id'])
      .leftJoinAndSelect('recipe.comentarii', 'comentarii')
      .leftJoin('comentarii.utilizator', 'autor')
      .addSelect(['autor.username', 'autor.pozaProfil', 'autor.id'])
      .where('recipe.id = :recipeId', { recipeId: parseInt(recipeId) })
      .andWhere('recipe.deletedAt IS NULL')
      .getOne();

      return recipe;

    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find recipe with id ${recipeId}`, { error });
    }
  };

  createRecipe = async (recipe: RecipeEntity): Promise<RecipeEntity> => {
    const recipeObject = this.recipeRepo.create(recipe);

    try {
      await this.recipeRepo.insert(recipeObject);
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new recipe: ${JSON.stringify(error)}`, { error });
    }

    try {
      this.rabbitmqService.emit('feed__new_recipe', recipeObject );
    } catch (error) {
      console.log("Rabbit MQ error " ,error)
    }

    return recipeObject;
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

  getFollowingRecipesFeedForUser = async (userId: string): Promise<RecipeViewEntity[]> => {
    //take recipesIds from redis by userId
    let recipeIds;
    try {
      const min = new Date();
      min.setDate(min.getDate() - 3);
      const max = new Date();
      console.log("min", min.getTime())
      console.log("max", max.getTime())

      recipeIds = await this.redisRepository.zrangebyscore('user', userId, min.getTime(), max.getTime());
    } catch (error) {
      console.log(error) 
    }

    if (!recipeIds || recipeIds.length === 0) {
      return [];
    }

    let recipes;
    try {

      const query = `
        SELECT * FROM reteta_feed
        WHERE id = ANY($1)
        ORDER BY created_at DESC
      `;

      recipes = await this.entityManager.query(query, [recipeIds]);
      console.log("REZULTAT ", recipes);
    } catch (error) {
      console.log(error);
    }

    return recipes;
  };

  getRecipesFeedForUser = async (userId: string): Promise<RecipeViewEntity[]> => {
    // Step 1: Fetch recipeIds from Redis
    let recipeIds;
    try {
      const min = new Date();
      min.setDate(min.getDate() - 3);
      const max = new Date();
      console.log("min", min.getTime())
      console.log("max", max.getTime())

      recipeIds = await this.redisRepository.zrangebyscore('user', userId, min.getTime(), max.getTime());
    } catch (error) {
      console.log(error) 
    }

    console.log("recipeIds ", recipeIds);

    let recipes = [];
    try {
        // Convert recipeIds to integers
        let recipeIds2 = recipeIds.map(id => parseInt(id, 10));

        // Step 2 and 3: Query to fetch recipes by ids and recent recipes excluding those ids
        const query = `
            SELECT * FROM reteta_feed
            WHERE created_at > current_date - interval '10' day
            AND (array_length($1::bigint[], 1) IS NULL OR id != ALL($1))
            ORDER BY created_at DESC
            LIMIT 30
        `;

        recipes = await this.entityManager.query(query, [recipeIds2]);
        console.log("REZULTAT ", recipes);
    } catch (error) {
        console.log(error);
    }

    return recipes;
};



}
