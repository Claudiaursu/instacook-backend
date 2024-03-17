import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.enableCors({
    //origin: 'http://192.168.100.46:8081',
    origin: '*'
  });  

  await app.listen(8080);
  //await app.listen(8080, '0.0.0.0');
}

bootstrap();

