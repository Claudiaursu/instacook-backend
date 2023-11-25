import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import { RabbitmqModule } from '@app/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { DatabaseModule } from '@app/common/database/database.module';
import { CollectionModule } from './collection/collection.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule.register({
      name: USER_INTERACTION_SERVICE,
    }),
    // AuthModule,
    CollectionModule,
    RecipeModule
  ],
  controllers: [CookingController],
  providers: [CookingService],
})
export class CookingModule {}
