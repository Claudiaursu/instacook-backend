import { NestFactory } from '@nestjs/core';
import { CookingModule } from './cooking.module';

async function bootstrap() {
  const app = await NestFactory.create(CookingModule);
  await app.listen(3000);
}
bootstrap();
