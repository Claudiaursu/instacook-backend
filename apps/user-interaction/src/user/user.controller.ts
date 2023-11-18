import { ApiBody, ApiOAuth2, ApiTags, ApiParam, ApiOperation, ApiConsumes} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult, EntityManager, getManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage, Multer } from 'multer';
import { createWriteStream, fstatSync } from 'fs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectEntityManager('default')
    private entityManager: EntityManager,
    ) { }

  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  async findAllUsers(): Promise<UserEntity[]> {
    try {
      const allUsers = await this.userService.getAllUsers();
      return allUsers;
    } catch (error) {
        return error;
      //logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all topics`, {error})
    }
  }

//   // Get a topic by id 
//   @Get('/:topicId')
//   //@Permissions('fast:read')
//   @ApiParam({
//     name: 'topicId',
//     type: 'string',
//     schema: {
//       example: '1',
//     },
//   })
//   @ApiOperation({ summary: 'Get a topic by its id' })
//   async findTopic(@Param('topicId') topicId: string): Promise<TopicEntity | null> {
//     try {
//       const topic = await this.topicService.getTopicById(topicId);
//       return topic;
//     } catch (error) {
//       logger.throw("01FWY1EFYT4S0XXXT3S31459PG", `Could not find topic with id ${topicId}`)
//     }
//   }

 // Create a new user
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
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(@Body() user: UserEntity, @Res() res: Response) {
    try {
      const userClass = plainToClass(UserEntity, user);
      const createdObject = await this.userService.createUser(userClass);
      res = res.json(createdObject);
      return res;
    } catch (error) {
      res.status(500).send(`Could not create new user: ${error}`);
      //logger.throw("01FWY1DCZNHZNJ7Z114PPC1D4T", `Could not create topic`, {error})
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

//   @Patch(':topicId')
//   //@Permissions('fast:read')
//   @ApiOperation({ summary: 'Update a topic' })
//   @ApiParam({
//     name: 'topicId',
//     type: 'number',
//     schema: {
//       default: 1,
//     },
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       example: {
//         topicName: 'Puppet Basics',
//         popularityScore: 7.6,
//         topicDescription: 'The goal is to understand how puppet works.'
//       }
//     },
//   })
//   async updateTopic(@Body() topic: TopicEntity, @Param('topicId') topicId: string, @Res() res: Response) {
//     try {
//       const topicClass = plainToClass(TopicEntity, topic);
//       const createdObject = await this.topicService.updateTopic(topicId, topicClass);
//       res = res.json(createdObject);
//       return res;
//     } catch (error) {
//       logger.throw("01G40QBR1WV89Z4NDEERRQYED7", `Could not update topic with id ${topicId}`, {error})
//     }
//   }

//   // Delete a topic by id
//   @Delete(':topicId')
//   //@Permissions('fast:read')
//   @ApiOperation({ summary: 'Deletes a topic by id' })
//   @ApiParam({
//     name: 'topicId',
//     type: 'number',
//     schema: {
//       default: 1,
//     },
//   })
//   async deleteTopic(@Param('topicId') topicId: number): Promise<DeleteResult> {
//     try {
//       const deleteResult = await this.topicService.deleteTopic(topicId);
//       return deleteResult;
//     } catch (error) {
//       logger.throw("01FWY4F1RYZ8BS4N6C65V0RHHH", `Could not delete topic with id ${topicId}`, {error})
//     }
//   }

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
