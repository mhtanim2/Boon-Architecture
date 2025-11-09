import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonAccountsEntity } from '@boon/backend/database/entities/boon';
import { NamedSingleErrorWithCtx } from '@boon/common/core';
import { CreateUser } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { z } from 'zod';

@Injectable()
export class UsersValidationService {
  constructor(
    @InjectRepository(BoonAccountsEntity, BOON_DATASOURCE)
    private readonly accountsRepository: Repository<BoonAccountsEntity>
  ) {}

  async checkPreValidity(dto: CreateUser) {
    const errors = [];

    const isUsernameAvailable = await this.isUsernameAvailable(dto);
    if (!isUsernameAvailable) {
      const ctx = { username: dto.username };
      errors.push(new UsernameNotAvailableError({ ctx }));
    }

    // const areClienteAndClientiRelationshipsCoherent = await this.areClienteAndClientiRelationshipsCoherent(dto);
    // if (!areClienteAndClientiRelationshipsCoherent) {
    //   const ctx = {
    //     cliente: dto.cliente.id,
    //     clienti: dto.clienti.map((cliente) => cliente.id),
    //   };
    //   errors.push(new ClienteClientiNotCoherentError({ ctx }));
    // }

    switch (true) {
      case errors.length > 1:
        throw new AggregateError(errors);
      case errors.length === 1:
        throw errors[0];
    }
  }

  async isUsernameAvailable(user: Pick<CreateUser, 'username'>) {
    return (await this.accountsRepository.countBy({ username: user.username })) === 0;
  }

  // async areClienteAndClientiRelationshipsCoherent(user: Pick<CreateUser, 'cliente' | 'clienti'>) {
  //   return user.clienti.length === 1 && user.cliente.id === user.clienti[0].id;
  // }
}

export const UsernameNotAvailableErrorDef = {
  statusCode: 400,
  code: `USERNAME_NOT_AVAILABLE`,
  message: `Username '{username}' is not available.`,
  ctx: z.object({
    username: z.string(),
  }),
};
export class UsernameNotAvailableError extends NamedSingleErrorWithCtx(UsernameNotAvailableErrorDef) {}

export const ClienteClientiNotCoherentErrorDef = {
  statusCode: 400,
  code: `CLIENTE_CLIENTI_NOT_COHERENT`,
  message: `Properties 'cliente' ({cliente}) and 'clienti' ({clienti}) are not coherent.`,
  ctx: z.object({
    cliente: z.number(),
    clienti: z.array(z.number()),
  }),
};
export class ClienteClientiNotCoherentError extends NamedSingleErrorWithCtx(ClienteClientiNotCoherentErrorDef) {}
