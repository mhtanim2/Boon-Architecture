import { Test, TestingModule } from '@nestjs/testing';
import { TenantsRolesController } from './tenants-roles.controller';
import { TenantsRolesService } from './tenants-roles.service';

describe('TenantsRolesController', () => {
  let controller: TenantsRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsRolesController],
      providers: [TenantsRolesService],
    }).compile();

    controller = module.get<TenantsRolesController>(TenantsRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
