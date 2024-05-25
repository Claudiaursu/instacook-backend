import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { NotificationsModule } from './notifications.module';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  
  await app.listen(9082);
}
bootstrap();
