import { Test, TestingModule } from '@nestjs/testing';
import { UsersAuthService } from './users-auth.service';
import { UsersMeController } from './users-me.controller';

describe('UsersMeController', () => {
  let controller: UsersMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersMeController],
      providers: [UsersAuthService],
    }).compile();

    controller = module.get<UsersMeController>(UsersMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
