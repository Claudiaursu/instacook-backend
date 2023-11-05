import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

interface DatabaseModuleOptions {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

@Module({
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  static register({
    host,
    port,
    database,
    username,
    password
  }: DatabaseModuleOptions) : DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host,
            port,
            database,
            username,
            password,
            ssl: false,
            autoLoadEntities: true,
            synchronize: false,
            applicationName: "insta-cook",
            namingStrategy: new SnakeNamingStrategy(),
          }),
          inject: [ConfigService],
        })
      ]
    }
  }
}
