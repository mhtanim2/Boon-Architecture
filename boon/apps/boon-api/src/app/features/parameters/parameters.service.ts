import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonParametriEntity } from '@boon/backend/database/entities/boon';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chain } from 'lodash';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ParametersService {
  constructor(
    @InjectRepository(BoonParametriEntity, BOON_DATASOURCE)
    private readonly parametriRepository: Repository<BoonParametriEntity>
  ) {}

  public async retrieveConfigFromDatabase(startsWith?: string) {
    const findBy = startsWith ? { nome: Like(`${startsWith}%`) } : {};

    const parameters = await this.parametriRepository.findBy(findBy);
    const rawConfig = chain(parameters)
      .keyBy((p) => p.nome)
      .mapValues((p) => p.valore)
      .value();

    return rawConfig;
  }
}
