import { Test, TestingModule } from '@nestjs/testing';
import { TenantsPrivilegesController } from './tenants-privileges.controller';
import { TenantsPrivilegesService } from './tenants-privileges.service';

describe('TenantsPrivilegesController', () => {
  let controller: TenantsPrivilegesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsPrivilegesController],
      providers: [TenantsPrivilegesService],
    }).compile();

    controller = module.get<TenantsPrivilegesController>(TenantsPrivilegesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
