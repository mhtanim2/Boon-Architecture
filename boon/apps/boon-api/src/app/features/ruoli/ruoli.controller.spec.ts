import { Test, TestingModule } from '@nestjs/testing';
import { RuoliController } from './ruoli.controller';
import { RuoliService } from './ruoli.service';

describe('RuoliController', () => {
  let controller: RuoliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuoliController],
      providers: [RuoliService],
    }).compile();

    controller = module.get<RuoliController>(RuoliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
