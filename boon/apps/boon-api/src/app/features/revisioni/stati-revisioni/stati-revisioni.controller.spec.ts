import { Test, TestingModule } from '@nestjs/testing';
import { StatiRevisioniController } from './stati-revisioni.controller';
import { StatiRevisioniService } from './stati-revisioni.service';

describe('StatiRevisioniController', () => {
  let controller: StatiRevisioniController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatiRevisioniController],
      providers: [StatiRevisioniService],
    }).compile();

    controller = module.get<StatiRevisioniController>(StatiRevisioniController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
