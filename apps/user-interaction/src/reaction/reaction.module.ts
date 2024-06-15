import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { ReactionController } from './reaction.controller';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { CommentEntity } from '../entities/comment.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { UrmarireEntity } from '../entities/urmarire.entity';
import { ReactionService } from './reaction.service';
import { ReactionEntity } from '../entities/reaction.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'USER_INTERACTION',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'RABBIT_MQ_USER_INTERACTION_QUEUE',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'FEED',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'RABBIT_MQ_FEED_QUEUE',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     RecipeEntity,
     CuisineEntity,
     UrmarireEntity,
     ReactionEntity,
     NotificationEntity
    ]),
  ],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
