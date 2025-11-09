import { Test, TestingModule } from '@nestjs/testing';
import { TenantsPrivilegesService } from './tenants-privileges.service';

describe('TenantsPrivilegesService', () => {
  let service: TenantsPrivilegesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsPrivilegesService],
    }).compile();

    service = module.get<TenantsPrivilegesService>(TenantsPrivilegesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
