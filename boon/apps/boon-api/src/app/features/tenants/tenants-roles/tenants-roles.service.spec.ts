import { Test, TestingModule } from '@nestjs/testing';
import { TenantsRolesService } from './tenants-roles.service';

describe('TenantsRolesService', () => {
  let service: TenantsRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsRolesService],
    }).compile();

    service = module.get<TenantsRolesService>(TenantsRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
