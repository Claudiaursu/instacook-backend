import { NestFactory } from '@nestjs/core';
import { UserInteractionModule } from './user-interaction.module';
import { RabbitmqService } from '@app/common';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(UserInteractionModule);
  const rabbitmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rabbitmqService.getOptions('USER_INTERACTION'));
  
  app.enableCors({
   // origin: 'http://localhost:4200',
    origin: 'http://localhost:8080/v1/auth/login'
  }); 
  
  await app.listen(9083);
  //app.startAllMicroservices();
}
bootstrap();
