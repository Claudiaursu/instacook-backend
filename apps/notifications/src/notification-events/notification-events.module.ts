import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { NotificationEventsController } from './notification-events.controller';
import { NotificationEventsService } from './notification-events.service';
import { NotificationEntity } from '../entities/notification.entity';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { ReactionEntity } from 'apps/user-interaction/src/entities/reaction.entity';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from '../notification/notification.service';
import { RecipeService } from 'apps/cooking/src/recipe/recipe.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     UrmarireEntity,
     ReactionEntity,
     NotificationEntity,
     RecipeEntity,
     CuisineEntity,
     CompetitionEntity
    ]),
    ClientsModule.register([
      {
        name: 'USER_INTERACTION',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'RABBIT_MQ_USER_INTERACTION_QUEUE',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [NotificationEventsService, NotificationService],
  controllers: [NotificationEventsController],
})
export class NotificationEventsModule {}
