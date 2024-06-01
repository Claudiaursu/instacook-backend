import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

describe('FeedController', () => {
  let feedController: FeedController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [FeedService],
    }).compile();

    feedController = app.get<FeedController>(FeedController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(feedController.getHello()).toBe('Hello World!');
    });
  });
});
