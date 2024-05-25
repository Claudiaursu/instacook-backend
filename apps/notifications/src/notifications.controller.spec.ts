import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './notification/notification.service';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationService],
    }).compile();

    notificationsController = app.get<NotificationsController>(NotificationsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationsController.getHello()).toBe('Hello World!');
    });
  });
});
