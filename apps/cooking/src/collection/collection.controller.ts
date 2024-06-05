import { ApiBody, ApiOAuth2, ApiTags, ApiParam, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult, EntityManager, getManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CollectionService } from './collection.service';
import { CollectionEntity } from '../entities/collection.entity';
import { logger } from '@app/common/logger';
import { Public } from '../utils/guards/auth.guard';

@ApiTags('Collection')
@Controller('v1/collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    @InjectEntityManager('default')
    private entityManager: EntityManager,
  ) { }

  @Get('')
  @Public()
  @ApiOperation({ summary: 'Get all collections' })
  async findAllCollections(): Promise<CollectionEntity[]> {
    try {
      const allCollections = await this.collectionService.getAllCollections();
      return allCollections;

    } catch (error) {
      logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all topics`, { error })
      return error;
    }
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all collections for a user' })
  async findCollectionsForUser(@Param('userId') userId: string): Promise<CollectionEntity[]> {
    try {
      const allCollections = await this.collectionService.getCollectionsForUser(userId);
      return allCollections;

    } catch (error) {
      logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all users`, { error })
      return error;
    }
  }

  @Get('/public/user/:userId')
  @ApiOperation({ summary: 'Get all public collections for a user' })
  async findPublicCollectionsForUser(@Param('userId') userId: string): Promise<CollectionEntity[]> {
    try {
      const allCollections = await this.collectionService.getPublicCollectionsForUser(userId);
      return allCollections;

    } catch (error) {
      logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all public collections for user`, { error })
      return error;
    }
  }


  @Get('/:collectionId')
  @ApiParam({
    name: 'collectionId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get a collection by its id' })
  async findCollection(@Param('collectionId') collectionId: string): Promise<CollectionEntity | null> {
    try {
      const collection = await this.collectionService.getCollectionById(collectionId);
      return collection;

    } catch (error) {
      logger.throw("01FWY1EFYT4S0XXXT3S31459PG", `Could not find topic with id ${collectionId}`)
      return error;
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        topicName: 'Puppet Basics',
        popularityScore: 7.6,
        topicDescription: 'The goal is to understand how puppet works.'
      },
    },
  })
  @ApiOperation({ summary: 'Create a new collection' })
  async createCollection(@Body() collection: CollectionEntity, @Res() res: Response) {
    try {
      const collectionClass = plainToClass(CollectionEntity, collection);
      const createdObject = await this.collectionService.createCollection(collectionClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new collection: ${error}`);
      logger.throw("01FWY1DCZNHZNJ7Z114PPC1D4T", `Could not create collection`, { error })
    }
  }

  //   @Post('/upload')
  //   @UseInterceptors(FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: 'apps/portal/src/assets/png/topic-images',
  //       filename: (req, file, cb) => {
  //         cb(null, `${file.originalname}`)
  //       }
  //     }) 
  //   }))
  //   @ApiConsumes('multipart/form-data')
  //   @ApiBody({
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         file: { 
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   })
  //   async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //     return {
  //       path: file.path
  //     };
  //   }

  //   // Upsert a topic
  //   @Patch('')
  //   //@Permissions('fast:read')
  //   @ApiOperation({ summary: 'Update/Create a topic' })
  //   @ApiBody({
  //     schema: {
  //       type: 'object',
  //       example: {
  //         topicName: 'Puppet Basics',
  //         popularityScore: 7.6,
  //         topicDescription: 'The goal is to understand how puppet works.'
  //       },
  //     },
  //   })
  //   async upsertTopic(@Body() topic: TopicEntity, @Res() res: Response) {
  //     try {
  //       const topicClass = plainToClass(TopicEntity, topic);
  //       const createdObject = await this.topicService.upsertTopic(topicClass);
  //       res = res.json(createdObject);
  //       return res;
  //     } catch (error) {
  //       res.status(500).send(`Could not update topic: ${error}`);
  //       logger.throw("01FWY1DVD9QCNHJ7RSX9Y5FX9V", `Could not update topic`, {error})
  //     }
  //   }

  @Patch(':collectionId')
  @ApiOperation({ summary: 'Update a collection' })
  @ApiParam({
    name: 'collectionId',
    type: 'number',
    schema: {
      default: 1,
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        topicName: 'Puppet Basics',
        popularityScore: 7.6,
        topicDescription: 'The goal is to understand how puppet works.'
      }
    },
  })
  async updateCollection(@Body() collection: CollectionEntity, @Param('collectionId') collectionId: string, @Res() res: Response) {
    try {
      const collectionClass = plainToClass(CollectionEntity, collection);
      const createdObject = await this.collectionService.updateCollection(collectionId, collectionClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      logger.throw("01G40QBR1WV89Z4NDEERRQYED7", `Could not update collection with id ${collectionId}`, { error })
    }
  }

  @Delete('/:collectionId')
  @ApiOperation({ summary: 'Deletes a collection by id' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    schema: {
      default: 1,
    },
  })
  async deleteUser(@Param('collectionId') collectionId: number): Promise<DeleteResult> {
    try {
      const deleteResult = await this.collectionService.deleteCollection(collectionId);
      return deleteResult;
    } catch (error) {
      logger.throw("01FWY4F1RYZ8BS4N6C65V0RHHH", `Could not delete collection with id ${collectionId}`, { error })
    }
  }

  //   // Get all topics
  //   @Get('topicsView/all')
  //   //@Permissions('fast:read')
  //   @ApiOperation({ summary: 'Get all topics' })
  //   async findAllTopicsFromView(): Promise<TopicViewEntity[]> {
  //     try {
  //       const entityManager = getManager();
  //       const topics = await entityManager.query('select * from itacademy.topics_view')    
  //       return topics;
  //     } catch (error) {
  //       logger.throw("01G3W1GGPXQVD6FK8KCY8M7JP3", `Could not find all topics`, {error})
  //     }

  //   }

}
