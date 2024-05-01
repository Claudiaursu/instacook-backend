import { Module } from '@nestjs/common';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';
import { RabbitmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { CommentModule } from './comment/comment.module';
import { CollectionModule } from 'apps/cooking/src/collection/collection.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './utils/guards/auth.guard';
import { FollowingModule } from './following/following.module';

@Module({
  imports: [  
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '6000s' },
      }),
    }),
    RabbitmqModule,
    UserModule,
    CommentModule,
    CollectionModule,
    FollowingModule
  ],
  controllers: [UserInteractionController],
  providers: [
    UserInteractionService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserInteractionModule {}
