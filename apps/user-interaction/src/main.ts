import { NestFactory } from '@nestjs/core';
import { UserInteractionModule } from './user-interaction.module';

async function bootstrap() {
  const app = await NestFactory.create(UserInteractionModule);
  await app.listen(3000);
}
bootstrap();
