import { Test, TestingModule } from '@nestjs/testing';
import { StatiArticoliController } from './stati-articoli.controller';
import { StatiArticoliService } from './stati-articoli.service';

describe('StatiArticoliController', () => {
  let controller: StatiArticoliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatiArticoliController],
      providers: [StatiArticoliService],
    }).compile();

    controller = module.get<StatiArticoliController>(StatiArticoliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
