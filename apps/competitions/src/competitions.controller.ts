import { Controller, Get } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';

@Controller()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  getHello(): string {
    return this.competitionsService.getHello();
  }
}
