import { ApiBody, ApiOAuth2, ApiTags, ApiParam, ApiOperation, ApiConsumes} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult, EntityManager, getManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { Public } from '../utils/guards/auth.guard';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectEntityManager('default')
    private entityManager: EntityManager,
    ) { }

  @Get('')
  @Public()
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

  // Get a user by id 
  @Get('/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get an user by its id' })
  async findUser(@Param('userId') userId: string): Promise<UserEntity | null> {
    try {
      const user = await this.userService.getUserById(userId);
      return user;
    } catch (error) {
      //logger.throw("01FWY1EFYT4S0XXXT3S31459PG", `Could not find topic with id ${topicId}`)
    }
  }

  @Get('/search/:query')
  @Public()
  @ApiParam({
    name: 'query',
    type: 'string',
    schema: {
      example: 'test',
    },
  })
  @ApiOperation({ summary: 'Get all users by search query' })
  async findUsersBySearch(@Param('query') query: string): Promise<UserEntity[]> {
    try {
      const allUsers = await this.userService.getAllUsersBySearchQuery(query);
      return allUsers;
    } catch (error) {
        return error;
      //logger.throw("01FWXNBDFSFMM8E47DCYY010ZF", `Could not find all topics`, {error})
    }
  }


    // Get a user by email
    @Get('/email/:email')
    @Public()
    @ApiParam({
      name: 'email',
      type: 'string',
      schema: {
        example: '1',
      },
    })
    @ApiOperation({ summary: 'Get an user by its email' })
    async findUserByEmail(@Param('email') email: string): Promise<UserEntity | null> {
      try {
        const user = await this.userService.getUserByEmail(email);
        return user;
      } catch (error) {
        //logger.throw("01FWY1EFYT4S0XXXT3S31459PG", `Could not find topic with id ${topicId}`)
      }
    }

  // Get a user by username
  @Get('/username/:username')
  @Public()
  @ApiParam({
    name: 'username',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get an user by its username' })
  async findUserByUsername(@Param('username') username: string): Promise<UserEntity | null> {
    try {
      const user = await this.userService.getUserByUsername(username);
      return user;
    } catch (error) {
      //logger.throw("01FWY1EFYT4S0XXXT3S31459PG", `Could not find topic with id ${topicId}`)
    }
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update an user' })
  @ApiParam({
    name: 'userId',
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
  async updateUser(@Body() user: UserEntity, @Param('userId') userId: string, @Res() res: Response) {
    try {
      const userClass = plainToClass(UserEntity, user);
      const createdObject = await this.userService.updateUser(userId, user);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      console.log(error)
      //logger.throw("01G40QBR1WV89Z4NDEERRQYED7", `Could not update collection with id ${collectionId}`, { error })
    }
  }



  // Login user by credentials
  @Post('/login')
  @Public()
  @ApiBody({
    schema: {
      type: 'object'
    },
  })
  @ApiOperation({ summary: 'Login a user' })
  async loginUser(@Body() body: any, @Res() res: Response): Promise<UserEntity | Object>  {
    try {
      const user = await this.userService.getUserByCredentials(body.username, body.password);

      if (user) {
        res.status(200).json( { id: user.id, isAuthenticated: true } ) ;
        return user.id;
      } else {
        res.status(500).json({status: 1});
        return { status: 0, message: 'User not found' };
      }

    } catch (error) {
      res.status(500).send(`Could not login user: ${error}`);
    }
  }

    // Login user by credentials
    @Post('/passReset')
    @Public()
    @ApiBody({
      schema: {
        type: 'object'
      },
    })
    @ApiOperation({ summary: 'reset a password' })
    async resetPassword(@Body() body: any, @Res() res: Response) {
      try {
        const username = body.username;
        const oldPassword = body.oldPassword;
        const newPassword = body.newPassword;
        const response = await this.userService.resetPassword(username, oldPassword, newPassword);
        
        res = res.json(response);
        console.log("PAROLA SCHIMBATA CU SUCCES ", res)
        return {
          status: 0
        };

      } catch (error) {
        console.log("eroare din controller ", error)
        res.status(500).send(`Could not login user: ${error}`);
      }
    }

 // Create a new user
  @Post('')
  @Public()
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

  // Delete an user by id
  @Delete(':userId')
  @ApiOperation({ summary: 'Deletes an user by id' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    schema: {
      default: 1,
    },
  })
  async deleteUser(@Param('userId') userId: number): Promise<DeleteResult> {
    try {
      const deleteResult = await this.userService.deleteUser(userId);
      return deleteResult;
    } catch (error) {
      //logger.throw("01FWY4F1RYZ8BS4N6C65V0RHHH", `Could not delete topic with id ${topicId}`, {error})
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
