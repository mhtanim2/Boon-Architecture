import { Test, TestingModule } from '@nestjs/testing';
import { TenantsFeaturesController } from './tenants-features.controller';
import { TenantsFeaturesService } from './tenants-features.service';

describe('TenantsFeaturesController', () => {
  let controller: TenantsFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsFeaturesController],
      providers: [TenantsFeaturesService],
    }).compile();

    controller = module.get<TenantsFeaturesController>(TenantsFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
