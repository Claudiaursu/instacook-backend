import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore  from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { RecipeService } from 'apps/cooking/src/recipe/recipe.service';
import { HttpModule } from '@nestjs/axios';
import { FeedEventsModule } from './feed-events/feed-events.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    RabbitmqModule.register({
      name: 'USER_INTERACTION',
    }),
    FeedEventsModule
  ],
  controllers: [FeedController],
  providers: [
    FeedService
  ],
})
export class FeedModule {}
