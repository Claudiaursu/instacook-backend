import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { logger } from '@app/common/logger';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';

@Injectable()
export class NotificationService extends TypeOrmBaseService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    protected readonly notificationRepo: Repository<NotificationEntity>,
  ) {
    super();
  }

  getAllNotificationsForUser = async (userId: string): Promise<NotificationEntity[]> => {
    const notifications = await this.notificationRepo.find({
      where: {
        utilizator: {
          id: parseInt(userId),
        },
      },
      order: {
        createdAt: 'DESC', // Assuming you have a createdAt field in CommentEntity
      },
    });
    return Promise.resolve(notifications);
  };

  getAllUnseenNotificationsForUser = async (userId: string): Promise<NotificationEntity[]> => {
    const notifications = await this.notificationRepo.find({
      where: {
        utilizator: {
          id: parseInt(userId),
        },
        citita: false
      },
      order: {
        createdAt: 'DESC', // Assuming you have a createdAt field in CommentEntity
      },
    });
    return Promise.resolve(notifications);
  };

  updateNotification = async (notificationId: string, notification: NotificationEntity): Promise<any> => {
    const existingObject = await this.notificationRepo.findOne({
      where: {
        id: parseInt(notificationId),
      },
    });

    try {
      if (existingObject) {
        const updatedResult = await this.notificationRepo.update(parseInt(notificationId), notification);
        return updatedResult;
      }
    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any notification with id ${notificationId}`, error);
    }
  };


  markAsSeenNotificationsForUser = async (userId: string): Promise<any> => {
    console.log("pentru userId: ", userId)
    try {
    
      await this.notificationRepo.update(
        { utilizator: { id: parseInt(userId) } },
        { citita: true }
      );
     
    } catch (error) {
      logger.throw("01J4GH5N7M38K2H9FV1DZW4Q9P", `Could not find any notification`, error);
    }
  };

  async countUnseenNotificationsForUser(userId: string): Promise<{count: number}> {
    try {
      const userIdInt = parseInt(userId);
      const count = await this.notificationRepo.count({
        where: {
          utilizator: { id: userIdInt },
          citita: false,
        },
      });

      return {
        count
      };
    } catch (error) {
      console.error(`Could not count unseen notifications for user ${userId}:`, error);
      throw new Error("Could not count unseen notifications");
    }
  }

  // deleteRecipe = async (recipeId: number): Promise<DeleteResult> => {
  //   try {
  //     const deleteResult = await this.recipeRepo.delete(recipeId);
  //     return deleteResult;

  //   } catch (error) {
  //     logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete recipe: ${JSON.stringify(error)}`);
  //   }
  // };
}
