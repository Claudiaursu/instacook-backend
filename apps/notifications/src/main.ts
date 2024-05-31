import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { NotificationsModule } from './notifications.module';
import { RabbitmqService } from '@app/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config(); 

// async function bootstrap() {
//   const app = await NestFactory.create(NotificationsModule);
//   const rabbitmqService = app.get<RabbitmqService>(RabbitmqService);
//   app.connectMicroservice(rabbitmqService.getOptions('USER_INTERACTION'));

  
//   //await app.listen(9082);
// }
// bootstrap();


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
