import { Test, TestingModule } from '@nestjs/testing';
import { LivelliPrivilegioService } from './livelli-privilegio.service';

describe('LivelliPrivilegioService', () => {
  let service: LivelliPrivilegioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivelliPrivilegioService],
    }).compile();

    service = module.get<LivelliPrivilegioService>(LivelliPrivilegioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
