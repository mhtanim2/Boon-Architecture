import { Module } from '@nestjs/common';
import { ClientiModule } from '../clienti/clienti.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ClientiModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
