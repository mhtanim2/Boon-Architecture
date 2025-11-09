import { Test, TestingModule } from '@nestjs/testing';
import { StatiAccountsController } from './stati-accounts.controller';
import { StatiAccountsService } from './stati-accounts.service';

describe('StatiAccountsController', () => {
  let controller: StatiAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatiAccountsController],
      providers: [StatiAccountsService],
    }).compile();

    controller = module.get<StatiAccountsController>(StatiAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
