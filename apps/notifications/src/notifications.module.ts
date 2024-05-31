import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationEventsModule } from './notification-events/notification-events.module';
import { RecipeService } from 'apps/cooking/src/recipe/recipe.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    //DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: '../.env',
      //envFilePath: path.resolve(__dirname, '../.env'), // Resolve the absolute path
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port:  parseInt(configService.get<string>('PG_PORT')),
        database: configService.get<string>('PG_DATABASE'),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASS'),
        ssl: false,
        autoLoadEntities: true,
        synchronize: false,
        applicationName: "insta-cook",
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService],
    }),
    RabbitmqModule.register({
      name: 'USER_INTERACTION',
    }),
    NotificationModule,
    NotificationEventsModule
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService
  ],
})
export class NotificationsModule {}
