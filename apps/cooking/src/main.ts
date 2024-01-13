import { NestFactory } from '@nestjs/core';
import { CookingModule } from './cooking.module';
import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(CookingModule);
  
  app.enableCors({
    origin: 'http://localhost:4200',
  });  
  
  await app.listen(3333);
}
bootstrap();
