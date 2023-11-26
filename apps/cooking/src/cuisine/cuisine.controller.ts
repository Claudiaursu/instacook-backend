import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { CuisineService } from './cuisine.service';  // Make sure you have a CuisineService defined
import { CuisineEntity } from '../entities/cuisine.entity';  // Make sure you have a CuisineEntity defined
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';

@ApiTags('Cuisine')
@Controller('v1/cuisines')
export class CuisineController {
  constructor(
    private readonly cuisineService: CuisineService,  // Inject the CuisineService
  ) { }

  @Get('')
  @ApiOperation({ summary: 'Get all cuisines' })
  async findAllCuisines(): Promise<CuisineEntity[]> {
    try {
      const allCuisines = await this.cuisineService.getAllCuisines();
      return allCuisines;

    } catch (error) {
      logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all cuisines`, { error })
      return error;
    }
  }

  @Get('/:cuisineId')
  @ApiParam({
    name: 'cuisineId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get a cuisine by its id' })
  async findCuisine(@Param('cuisineId') cuisineId: string): Promise<CuisineEntity | null> {
    try {
      const cuisine = await this.cuisineService.getCuisineById(cuisineId);
      return cuisine;

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find cuisine with id ${cuisineId}`)
      return error;
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        cuisineName: 'Italian',
        description: 'Delicious Italian dishes',
      },
    },
  })
  @ApiOperation({ summary: 'Create a new cuisine' })
  async createCuisine(@Body() cuisine: CuisineEntity, @Res() res: Response) {
    try {
      const cuisineClass = plainToClass(CuisineEntity, cuisine);
      const createdObject = await this.cuisineService.createCuisine(cuisineClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new cuisine: ${error}`);
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create cuisine`, { error })
    }
  }

  @Patch(':cuisineId')
  @ApiOperation({ summary: 'Update a cuisine' })
  @ApiParam({
    name: 'cuisineId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        numeBucatarie: 'Italian',
        descriereBucatarie: 'Authentic Italian dishes',
      }
    },
  })
  async updateCuisine(@Body() cuisine: CuisineEntity, @Param('cuisineId') cuisineId: string, @Res() res: Response) {
    try {
      const updatedObject = await this.cuisineService.updateCuisine(cuisineId, cuisine);
      res = res.json(updatedObject);
      return res;

    } catch (error) {
      logger.throw("01J4GH5S7R38W2K9FV1DZW4Q9P", `Could not update cuisine with id ${cuisineId}`, { error })
    }
  }

  @Delete('/:cuisineId')
  @ApiOperation({ summary: 'Deletes a cuisine by id' })
  @ApiParam({
    name: 'cuisineId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  async deleteCuisine(@Param('cuisineId') cuisineId: string): Promise<DeleteResult> {
    try {
      const deleteResult = await this.cuisineService.deleteCuisine(parseInt(cuisineId));
      return deleteResult;
    } catch (error) {
      logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not delete cuisine with id ${cuisineId}`, { error })
    }
  }
}
