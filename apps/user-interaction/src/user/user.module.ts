import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CollectionEntity } from 'apps/cooking/src/entities/collection.entity';
import { CommentEntity } from '../entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UrmarireEntity } from '../entities/urmarire.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity,
     CollectionEntity,
     CommentEntity,
     UrmarireEntity
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
