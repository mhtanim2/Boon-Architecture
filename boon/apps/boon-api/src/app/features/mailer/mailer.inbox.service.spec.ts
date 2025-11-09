import { Test, TestingModule } from '@nestjs/testing';
import { MailerInboxService } from './mailer.inbox.service';

describe('MailerInboxService', () => {
  let service: MailerInboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerInboxService],
    }).compile();

    service = module.get<MailerInboxService>(MailerInboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
