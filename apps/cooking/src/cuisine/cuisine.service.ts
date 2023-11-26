import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { CuisineEntity } from '../entities/cuisine.entity';  // Make sure you have CuisineEntity defined
import { logger } from '@app/common/logger';

@Injectable()
export class CuisineService extends TypeOrmBaseService<CuisineEntity> {
  constructor(
    @InjectRepository(CuisineEntity)
    protected readonly cuisineRepo: Repository<CuisineEntity>,
  ) {
    super();
  }

  getAllCuisines = async (): Promise<CuisineEntity[]> => {
    const cuisines = await this.cuisineRepo.find({
      order: {
        numeBucatarie: 'ASC',
      },
    });
    return Promise.resolve(cuisines);
  };

  getCuisineById = async (cuisineId: string): Promise<CuisineEntity> => {
    try {
      const cuisine = await this.cuisineRepo.findOne({
        where: {
          id: parseInt(cuisineId),
          deletedAt: null,
        },
      });
      return cuisine;

    } catch (error) {
      logger.throw("01J4GH5K7F38X2N9V4J8DWZ1QM", `Could not find cuisine with id ${cuisineId}`, { error });
    }
  };

  createCuisine = async (cuisine: CuisineEntity): Promise<CuisineEntity> => {
    const cuisineObject = this.cuisineRepo.create(cuisine);

    try {
      await this.cuisineRepo.insert(cuisineObject);
      return cuisineObject;
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new cuisine: ${JSON.stringify(error)}`, { error });
    }
  };

  updateCuisine = async (cuisineId: string, cuisine: CuisineEntity): Promise<any> => {
    const existingObject = await this.cuisineRepo.findOne({
      where: {
        id: parseInt(cuisineId),
      },
    });

    try {
      if (existingObject) {
        const updatedResult = await this.cuisineRepo.update(parseInt(cuisineId), cuisine);
        return updatedResult;
      }

    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any cuisine with id ${cuisineId}`);
    }
  };

  deleteCuisine = async (cuisineId: number): Promise<DeleteResult> => {
    try {
      const deleteResult = await this.cuisineRepo.delete(cuisineId);
      return deleteResult;

    } catch (error) {
      logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete cuisine: ${JSON.stringify(error)}`);
    }
  };
}
