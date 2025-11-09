import { Test, TestingModule } from '@nestjs/testing';
import { LivelliPrivilegioController } from './livelli-privilegio.controller';
import { LivelliPrivilegioService } from './livelli-privilegio.service';

describe('LivelliPrivilegioController', () => {
  let controller: LivelliPrivilegioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivelliPrivilegioController],
      providers: [LivelliPrivilegioService],
    }).compile();

    controller = module.get<LivelliPrivilegioController>(LivelliPrivilegioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
