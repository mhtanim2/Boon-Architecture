import { Test, TestingModule } from '@nestjs/testing';
import { StatiArticoliService } from './stati-articoli.service';

describe('StatiArticoliService', () => {
  let service: StatiArticoliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatiArticoliService],
    }).compile();

    service = module.get<StatiArticoliService>(StatiArticoliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
