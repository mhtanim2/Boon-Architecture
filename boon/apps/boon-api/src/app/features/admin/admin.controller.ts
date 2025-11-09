import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
