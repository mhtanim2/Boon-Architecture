import { Test, TestingModule } from '@nestjs/testing';
import { ClientiController } from './clienti.controller';
import { ClientiService } from './clienti.service';

describe('ClientiController', () => {
  let controller: ClientiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientiController],
      providers: [ClientiService],
    }).compile();

    controller = module.get<ClientiController>(ClientiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
