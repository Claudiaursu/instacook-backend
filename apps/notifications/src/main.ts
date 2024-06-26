import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { NotificationsModule } from './notifications.module';
import { RabbitmqService } from '@app/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'RABBIT_MQ_USER_INTERACTION_QUEUE',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.listen();
}

bootstrap();
