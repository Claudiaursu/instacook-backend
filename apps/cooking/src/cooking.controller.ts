import { Controller, Get } from '@nestjs/common';
import { CookingService } from './cooking.service';

@Controller()
export class CookingController {
  constructor(private readonly cookingService: CookingService) {}

  @Get()
  getHello(): string {
    return this.cookingService.getHello();
  }
}
