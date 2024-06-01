import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FeedService {
  constructor(
    @Inject('USER_INTERACTION')
    private userInteractionClient: ClientProxy,
  ) {}

  async getHello() {
    await lastValueFrom(
      this.userInteractionClient.emit('notification', {
        test: 'test',
      }),
    );
    return 'Hello World!';
  }
}
