import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AzureSDKService } from './azure-sdk.service';
import { AzureSDKController } from './azure-sdk.controller';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [AzureSDKService],
  controllers: [AzureSDKController],
})
export class AzureSDKModule {}
