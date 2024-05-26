import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { CommentEntity } from '../entities/comment.entity';
import { RecipeEntity } from 'apps/cooking/src/entities/recipe.entity';
import { CuisineEntity } from 'apps/cooking/src/entities/cuisine.entity';
import { UrmarireEntity } from '../entities/urmarire.entity';
import { ReactionEntity } from '../entities/reaction.entity';
import { NotificationEntity } from 'apps/notifications/src/entities/notification.entity';
import { RabbitmqService } from '@app/common';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices';

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
  providers: [CommentService, RabbitmqService],
  controllers: [CommentController],
})
export class CommentModule {}
