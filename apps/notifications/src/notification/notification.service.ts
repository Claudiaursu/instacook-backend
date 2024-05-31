import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TypeOrmBaseService } from '../../../../libs/common/src/database/typeorm-base.service';
import { logger } from '@app/common/logger';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationService extends TypeOrmBaseService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    protected readonly notificationRepo: Repository<NotificationEntity>,
    //private readonly collectionService: CollectionService,

  ) {
    super();
  }

  createNotification = async (notification: NotificationEntity): Promise<NotificationEntity> => {
    const notificationObject = this.notificationRepo.create(notification);

    try {
      await this.notificationRepo.insert(notificationObject);
    } catch (error) {
      logger.throw('01J4GH5M7K38H9JVN2V1DZW4PQ', `Could not create new notification: ${JSON.stringify(error)}`, { error });
    }

    return notificationObject;
  };


  // deleteRecipe = async (recipeId: number): Promise<DeleteResult> => {
  //   try {
  //     const deleteResult = await this.recipeRepo.delete(recipeId);
  //     return deleteResult;

  //   } catch (error) {
  //     logger.throw('01J4GH5P7Q38W2K9FV4J8D9Z1M', `Could not delete recipe: ${JSON.stringify(error)}`);
  //   }
  // };
}
