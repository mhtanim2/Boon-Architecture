import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonFunzionalitaClientiEntity } from '@boon/backend/database/entities/boon';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsFeaturesService {
  constructor(
    @InjectRepository(BoonFunzionalitaClientiEntity, BOON_DATASOURCE)
    private readonly funzionalitaClientiRepository: Repository<BoonFunzionalitaClientiEntity>
  ) {}

  async getFunzionalita(clienteId: number) {
    const funzionalita = (
      await this.funzionalitaClientiRepository.find({
        relations: { funzionalita: true },
        where: { idCliente: clienteId },
        order: { id: 'asc' },
      })
    ).map((x) => x.funzionalita);
    return funzionalita;
  }
}
