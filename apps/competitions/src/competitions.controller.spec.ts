import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';

describe('CompetitionsController', () => {
  let competitionsController: CompetitionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionsController],
      providers: [CompetitionsService],
    }).compile();

    competitionsController = app.get<CompetitionsController>(CompetitionsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(competitionsController.getHello()).toBe('Hello World!');
    });
  });
});
