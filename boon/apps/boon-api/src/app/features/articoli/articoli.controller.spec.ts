import { Test, TestingModule } from '@nestjs/testing';
import { ArticoliController } from './articoli.controller';
import { ArticoliService } from './articoli.service';

describe('ArticoliController', () => {
  let controller: ArticoliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticoliController],
      providers: [ArticoliService],
    }).compile();

    controller = module.get<ArticoliController>(ArticoliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
