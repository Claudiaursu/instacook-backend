import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { FeedModule } from './feed.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(FeedModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'RABBIT_MQ_FEED_QUEUE',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.listen();
}

bootstrap();
