import { Test, TestingModule } from '@nestjs/testing';
import { RevisioniController } from './revisioni.controller';
import { RevisioniService } from './revisioni.service';

describe('RevisioniController', () => {
  let controller: RevisioniController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevisioniController],
      providers: [RevisioniService],
    }).compile();

    controller = module.get<RevisioniController>(RevisioniController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
