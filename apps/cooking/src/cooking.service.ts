import { Inject, Injectable } from '@nestjs/common';
import { USER_INTERACTION_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CookingService {
  constructor(
    @Inject(USER_INTERACTION_SERVICE)
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
