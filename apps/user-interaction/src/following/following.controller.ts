import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { FollowingService } from './following.service'; // Assuming you have a CommentService
import { CommentEntity } from '../entities/comment.entity'; // Assuming you have a CommentEntity
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';
import { UrmarireEntity } from '../entities/urmarire.entity';
import { Public } from 'apps/cooking/src/utils/guards/auth.guard';

@ApiTags('Following')
@Controller('v1/following')
export class FollowingController {
  constructor(
    private readonly followingService: FollowingService,
  ) { }

  @Public()
  @Get('/followers/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get all followers by userId' })
  async getFollowersForUser(@Param('userId') userId: string): Promise<UrmarireEntity[] | null> {
    try {
      const relations = await this.followingService.getFollowersForUser(userId);
      return relations;

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find relations for user with ${userId}`)
      return error;
    }
  }

  @Get('/follows/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get all users that a user follows' })
  async getUsersFollowedByUser(@Param('userId') userId: string): Promise<UrmarireEntity[] | null> {
    try {
      const relations = await this.followingService.getUsersFollowedByUser(userId);
      return relations;

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find relations for user with ${userId}`)
      return error;
    }
  }


  @Get('/status')
  @ApiOperation({ summary: 'Get status for 2 users' })
  async getFollowingStatus(@Query('source') source: string, @Query('destination') destination: string): Promise<{status: boolean} | null> {
    try {
      let followStatus = false;
      const relationStatus = await this.followingService.getRelationByUsersIds(source, destination);

      if (relationStatus) {
        followStatus = true;
      }
      return {
        status: followStatus
      };

    } catch (error) {
      logger.throw("01J4GH5P7RY8W2K9FV1DZW4Q9M", `Could not find follow status for users with ${source} and ${destination}`)
      return error;
    }
  }

  @Post('/follow')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        urmaritId: '1',
        urmaritor: '2',
      },
    },
  })
  @ApiOperation({ summary: 'This is a following request' })
  async createFollowingRelation(@Body() relation: UrmarireEntity, @Res() res: Response) {
    try {
      const followingClass = plainToClass(UrmarireEntity, relation);
      const createdObject = await this.followingService.createFollowingRelation(followingClass);
      res = res.json(createdObject);
      return res;

    } catch (error) {
      res.status(500).send(`Could not create new following relation: ${error}`);
      logger.throw("01J4GH5R7F38W2K9FV1DZW4Q9P", `Could not create following relation`, { error })
    }
  }

  @Post('/unfollow')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        urmaritId: '1',
        urmaritor: '2',
      },
    },
  })
  @ApiOperation({ summary: 'Unfollows by source id and destination id' })
  async deleteComment(@Body() relation: UrmarireEntity): Promise<DeleteResult> {
    try {
      const deleteResult = await this.followingService.deleteFollowing(relation);
      return deleteResult;
    } catch (error) {
      logger.throw("01J4GH5T7R38W2K9FV1DZW4Q9M", `Could not unfollow ${relation.urmarit} by ${relation.urmaritor}`, { error })
    }
  }
}
