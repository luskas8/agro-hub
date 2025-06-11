import { Test, TestingModule } from '@nestjs/testing';
import { RuralProductorService } from './rural-productor.service';

describe('RuralProductorService', () => {
  let service: RuralProductorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuralProductorService],
    }).compile();

    service = module.get<RuralProductorService>(RuralProductorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
