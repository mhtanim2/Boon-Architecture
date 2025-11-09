import { Test, TestingModule } from '@nestjs/testing';
import { StatiAccountsService } from './stati-accounts.service';

describe('StatiAccountsService', () => {
  let service: StatiAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatiAccountsService],
    }).compile();

    service = module.get<StatiAccountsService>(StatiAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
