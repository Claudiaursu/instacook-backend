import { Test, TestingModule } from '@nestjs/testing';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';

describe('CookingController', () => {
  let cookingController: CookingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CookingController],
      providers: [CookingService],
    }).compile();

    cookingController = app.get<CookingController>(CookingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cookingController.getHello()).toBe('Hello World!');
    });
  });
});
