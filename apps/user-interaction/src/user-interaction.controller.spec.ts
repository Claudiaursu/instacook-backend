import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionController', () => {
  let userInteractionController: UserInteractionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserInteractionController],
      providers: [UserInteractionService],
    }).compile();

    userInteractionController = app.get<UserInteractionController>(UserInteractionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userInteractionController.getHello()).toBe('Hello World!');
    });
  });
});
