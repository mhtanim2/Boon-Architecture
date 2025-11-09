import { Test, TestingModule } from '@nestjs/testing';
import { MailerInboxProcessor } from './mailer.inbox.processor';

describe('MailerInboxProcessor', () => {
  let processor: MailerInboxProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerInboxProcessor],
    }).compile();

    processor = module.get<MailerInboxProcessor>(MailerInboxProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});
