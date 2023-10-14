import { NestFactory } from '@nestjs/core';
import { UserInteractionModule } from './user-interaction.module';
import { RabbitmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserInteractionModule);
  const rabbitmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rabbitmqService.getOptions('USER_INTERACTION'));
  //await app.listen(3000);
  app.startAllMicroservices();
}
bootstrap();
