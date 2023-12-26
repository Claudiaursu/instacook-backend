import { Injectable } from '@nestjs/common';

@Injectable()
export class CompetitionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
