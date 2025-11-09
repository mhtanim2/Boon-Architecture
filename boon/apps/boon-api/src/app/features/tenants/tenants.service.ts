import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonClientiEntity, BoonTenantsEntity } from '@boon/backend/database/entities/boon';
import { Tenant } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(BoonTenantsEntity, BOON_DATASOURCE)
    private readonly tenantsRepository: Repository<BoonTenantsEntity>,
    @InjectRepository(BoonClientiEntity, BOON_DATASOURCE)
    private readonly clientiRepository: Repository<BoonClientiEntity>
  ) {}

  async getTenantBySlug(slug: string) {
    const tenant = await this.tenantsRepository.findOne({
      relations: { cliente: true },
      where: { slug: slug },
    });
    return tenant;
  }

  async getClienti(tenant: Tenant) {
    const clienti = await this.clientiRepository.find({
      relations: { tenant: true },
      where: [{ id: tenant.cliente.id }, { flagInterno: tenant.cliente.flagInterno ? false : undefined }],
      order: { id: 'asc' },
    });
    return clienti;
  }
}
