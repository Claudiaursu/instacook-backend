import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

@Module({
  imports: [
    ConfigModule.forRoot({
            envFilePath: '.env',
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

  ],
  providers: [],
  exports: [TypeOrmModule],
})

export class DatabaseModule {}

