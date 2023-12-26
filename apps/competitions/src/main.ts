import { NestFactory } from '@nestjs/core';
import { CompetitionsModule } from './competitions.module';

async function bootstrap() {
  const app = await NestFactory.create(CompetitionsModule);
  await app.listen(9082);
}
bootstrap();
