import { Module } from '@nestjs/common';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import { RabbitmqModule } from '@app/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { DatabaseModule } from '@app/common/database/database.module';
import { CollectionModule } from './collection/collection.module';
import { RecipeModule } from './recipe/recipe.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { ContestModule } from 'apps/competitions/src/contest/contest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import * as path from 'path';
import { AzureSDKModule } from './azure-sdk/azure-sdk.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './utils/guards/auth.guard';

@Module({
  imports: [
    //DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: '../.env',
      //envFilePath: path.resolve(__dirname, '../.env'), // Resolve the absolute path
      ignoreEnvFile: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: () => ({
    //     type: 'postgres',
    //     host: process.env.PG_HOST,
    //     port:  parseInt(process.env.PG_PORT),
    //     database: process.env.PG_DATABASE,
    //     username: process.env.PG_USER,
    //     password: process.env.PG_PASS,
    //     ssl: false,
    //     autoLoadEntities: true,
    //     synchronize: false,
    //     applicationName: "insta-cook",
    //     namingStrategy: new SnakeNamingStrategy()
    //   }),
    //   inject: [ConfigService],
    // }),
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
      name: USER_INTERACTION_SERVICE,
    }),
    CollectionModule,
    RecipeModule,
    CuisineModule,
    ContestModule,
    AzureSDKModule
  ],
  controllers: [CookingController],
  providers: [
    CookingService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CookingModule {}
