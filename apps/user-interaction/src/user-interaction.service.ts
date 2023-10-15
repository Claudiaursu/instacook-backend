import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserInteractionService {
  private readonly logger = new Logger(UserInteractionService.name);

  getHello(): string {
    return 'Hello World!';
  }

  notif(data: any) {
    this.logger.log('received notif', data);
  }
}
