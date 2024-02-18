import { ApiBody, ApiOAuth2, ApiTags, ApiParam, ApiOperation, ApiConsumes} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AzureSDKService } from './azure-sdk.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';


@ApiTags('Azure SDK')
@Controller('v1/azure-sdk')
export class AzureSDKController {
  constructor(private readonly azureSDKService: AzureSDKService) { }

  @Get('/:fileName')
  @ApiParam({
    name: 'fileName',
    type: 'string',
    schema: {
      example: '1',
    },
  })
  @ApiOperation({ summary: 'Get photo' })
  async getPhoto(@Param('fileName') fileName: string){
    try {
      const photo = await this.azureSDKService.getBlobPhoto(fileName);
      return photo;
    } catch (error) {
      console.log(error)
    }
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file', {}))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload photo' })
  async uploadPhotoToBlob(@UploadedFile() file: Express.Multer.File) {
    await this.azureSDKService.upload(file)
    const name = "https://mystorageaccountcc1.blob.core.windows.net/instacook-poze/" + file.originalname

    return {
      path: name
    };
  }

}

