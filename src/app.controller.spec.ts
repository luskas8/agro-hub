import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ForbiddenException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should throw exception', () => {
      expect(() => appController.index()).toThrow(ForbiddenException);
    });
    it('should return "OK" on health check', () => {
      expect(appController.healthCheck()).toBe('OK');
    });
  });
});
