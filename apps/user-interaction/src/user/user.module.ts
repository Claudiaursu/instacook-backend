import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
     UserEntity
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}