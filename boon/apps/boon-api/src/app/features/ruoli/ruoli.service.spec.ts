import { Test, TestingModule } from '@nestjs/testing';
import { RuoliService } from './ruoli.service';

describe('RuoliService', () => {
  let service: RuoliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuoliService],
    }).compile();

    service = module.get<RuoliService>(RuoliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
