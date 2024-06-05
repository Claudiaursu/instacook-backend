import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { CollectionEntity } from '../entities/collection.entity';
import { UserEntity } from 'apps/user-interaction/src/entities/user.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { CommentEntity } from 'apps/user-interaction/src/entities/comment.entity';
import { CuisineEntity } from '../entities/cuisine.entity';
import { CompetitionEntity } from 'apps/competitions/src/entities/competition.entity';
import { UrmarireEntity } from 'apps/user-interaction/src/entities/urmarire.entity';
import { CollectionService } from '../collection/collection.service';
import { ReactionEntity } from 'apps/user-interaction/src/entities/reaction.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';
import { RecipeViewEntity } from '../entities/recipe-view.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisRepository } from '../utils/redis.repository';
import { redisClientFactory } from '../utils/redis';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     CollectionEntity,
     RecipeEntity,
     CommentEntity,
     CuisineEntity,
     CompetitionEntity,
     UrmarireEntity,
     ReactionEntity,
     NotificationEntity,
     RecipeViewEntity
    ]),
    ClientsModule.register([
      {
        name: 'USER_INTERACTION',
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
  ],
  providers: [RecipeService, CollectionService, RedisRepository,  redisClientFactory],
  controllers: [RecipeController],
})
export class RecipeModule {}
