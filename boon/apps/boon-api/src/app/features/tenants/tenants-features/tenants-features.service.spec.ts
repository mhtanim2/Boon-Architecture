import { Test, TestingModule } from '@nestjs/testing';
import { TenantsFeaturesService } from './tenants-features.service';

describe('TenantsFeaturesService', () => {
  let service: TenantsFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsFeaturesService],
    }).compile();

    service = module.get<TenantsFeaturesService>(TenantsFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
