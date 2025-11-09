import { Test, TestingModule } from '@nestjs/testing';
import { StatiRevisioniService } from './stati-revisioni.service';

describe('StatiRevisioniService', () => {
  let service: StatiRevisioniService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatiRevisioniService],
    }).compile();

    service = module.get<StatiRevisioniService>(StatiRevisioniService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
