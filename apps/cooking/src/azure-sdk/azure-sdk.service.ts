import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AzureSDKService{
  private blobServiceClient;
  private containerName;

  constructor(
    private readonly configService: ConfigService
  ) {
    // this.blobServiceClient = BlobServiceClient.fromConnectionString(this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING'));
    // this.containerName = this.configService.get<string>('TFSTATE_CONTAINER_STORAGE_NAME');
    // this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    // this.containerName = process.env.TFSTATE_CONTAINER_STORAGE_NAME;
    this.blobServiceClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=mystorageaccountcc1;AccountKey=hDUCY6Wphk32g1+8n/Px83HFDQBuibLCx3Xyn8A+Euqrc0uVslIJdgMkNpCsV7ohA9bzSZ0V4YuS+AStmSUAiQ==;EndpointSuffix=core.windows.net");
    this.containerName = "instacook-poze";

  }

  async getBlobPhoto(imagePath: string): Promise<BlockBlobClient>{
    console.log(imagePath)
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imagePath);
    return blobClient;
  }
 
  async upload(file: Express.Multer.File){
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log("\t", blob.name);
    }
    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
    await blockBlobClient.uploadData(file.buffer);
  }
 
}
