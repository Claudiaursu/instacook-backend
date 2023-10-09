import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInteractionService {
  getHello(): string {
    return 'Hello World!';
  }
}
