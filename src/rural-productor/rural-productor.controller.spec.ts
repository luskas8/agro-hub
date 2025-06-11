import { Test, TestingModule } from '@nestjs/testing';
import { RuralProductorController } from './rural-productor.controller';
import { RuralProductorService } from './rural-productor.service';

describe('RuralProductorController', () => {
  let controller: RuralProductorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuralProductorController],
      providers: [RuralProductorService],
    }).compile();

    controller = module.get<RuralProductorController>(RuralProductorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
