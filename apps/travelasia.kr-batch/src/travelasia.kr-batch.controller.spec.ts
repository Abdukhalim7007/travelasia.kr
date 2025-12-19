import { Test, TestingModule } from '@nestjs/testing';
import { TravelasiaKrBatchController } from './travelasia.kr-batch.controller';
import { TravelasiaKrBatchService } from './travelasia.kr-batch.service';

describe('TravelasiaKrBatchController', () => {
  let travelasiaKrBatchController: TravelasiaKrBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TravelasiaKrBatchController],
      providers: [TravelasiaKrBatchService],
    }).compile();

    travelasiaKrBatchController = app.get<TravelasiaKrBatchController>(TravelasiaKrBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(travelasiaKrBatchController.getHello()).toBe('Hello World!');
    });
  });
});
