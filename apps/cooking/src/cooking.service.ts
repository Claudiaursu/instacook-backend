import { Injectable } from '@nestjs/common';

@Injectable()
export class CookingService {
  getHello(): string {
    return 'Hello World!';
  }
}
