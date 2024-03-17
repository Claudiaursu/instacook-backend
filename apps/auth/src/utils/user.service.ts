import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly httpService: HttpService
  ) {}

  async getUserByUsername(username: string): Promise<any> {
    const servicePath = `${process.env.USER_INTERACTION_URL}/username/${username}`;

    const result = await lastValueFrom(this.httpService.get<any>(servicePath));
    return result.data;
  }
}