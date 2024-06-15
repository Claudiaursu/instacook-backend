import { ApiBody, ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';
import { NotificationService } from './notification.service';
import { logger } from '@app/common/logger';
import { plainToClass } from 'class-transformer';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@ApiTags('Notifications')
@Controller('v1/notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @Get('/users/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get all notifications for user' })
  async findRecipesForUser(@Param('userId') userId: string): Promise<NotificationEntity[] | null> {
    try {
      const allNotificationsForUser = await this.notificationService.getAllNotificationsForUser(userId);
      return allNotificationsForUser;
      
    } catch (error) {
      logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all notifications for user`, { error })
      return error;
    }
  }

  @Get('/users/unseen/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get all unseen notifications for user' })
  async findUnseenNotificationsForUser(@Param('userId') userId: string): Promise<NotificationEntity[] | null> {
    try {
      const allNotificationsForUser = await this.notificationService.getAllNotificationsForUser(userId);
      return allNotificationsForUser;
      
    } catch (error) {
      logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all notifications for user`, { error })
      return error;
    }
  }

  @Get('/users/seen/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Mark as seen notifications for user' })
  async markAsSeenNotifications(@Param('userId') userId: string): Promise<{status: number}> {
    try {
      await this.notificationService.markAsSeenNotificationsForUser(userId);
      return {
        status: 0
      }
      
    } catch (error) {
      logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all notifications for user`, { error })
      return {
        status: 1
      };
    }
  }

  @Get('/count/unseen/:userId')
  @ApiParam({
    name: 'userId',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'count unseen notifications for user' })
  async countUnseenNotifcications(@Param('userId') userId: string): Promise<{count: number}> {
    try {
      const response = await this.notificationService.countUnseenNotificationsForUser(userId);
      return response;
      
    } catch (error) {
      return {
        count: 0
      }
      //logger.throw("01J4GH5NR8QVJYB9F6C65V0RHHH", `Could not find all notifications for user`, { error })
    }
  }


  @Patch(':notificationId')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    schema: {
      default: '1',
    },
  })
  @ApiBody({
    schema: {
      type: 'object'
    },
  })
  async updateNotification(@Body() notification: NotificationEntity, @Param('notificationId') notificationId: string, @Res() res: Response) {
    try {
      const updatedObject = await this.notificationService.updateNotification(notificationId, notification);
      res = res.json(updatedObject);
      return res;

    } catch (error) {
      logger.throw("01J4GH5S7R38W2K9FV1DZW4Q9P", `Could not update notification with id ${notificationId}`, { error })
    }
  }

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
