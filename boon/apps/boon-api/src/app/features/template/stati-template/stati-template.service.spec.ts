import { Test, TestingModule } from '@nestjs/testing';
import { StatiTemplateService } from './stati-template.service';

describe('StatiTemplateService', () => {
  let service: StatiTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatiTemplateService],
    }).compile();

    service = module.get<StatiTemplateService>(StatiTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
