import { Test, TestingModule } from '@nestjs/testing';
import { StatiTemplateController } from './stati-template.controller';
import { StatiTemplateService } from './stati-template.service';

describe('StatiTemplateController', () => {
  let controller: StatiTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatiTemplateController],
      providers: [StatiTemplateService],
    }).compile();

    controller = module.get<StatiTemplateController>(StatiTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
