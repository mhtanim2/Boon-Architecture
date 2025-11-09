import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonTenantsEntity } from '@boon/backend/database/entities/boon';
import { NamedSingleErrorWithCtx } from '@boon/common/core';
import { CreateCliente, UpdateCliente } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { z } from 'zod';

@Injectable()
export class ClientiValidationService {
  constructor(
    @InjectRepository(BoonTenantsEntity, BOON_DATASOURCE)
    private readonly tenantsRepository: Repository<BoonTenantsEntity>
  ) {}

  async checkPreValidity(idCliente: number | undefined, dto: CreateCliente | UpdateCliente) {
    const errors = [];

    if (dto.tenant?.slug !== undefined) {
      const isSlugAvailable = await this.isSlugAvailable(idCliente, dto);
      if (!isSlugAvailable) {
        const ctx = { slug: dto.tenant.slug };
        errors.push(new SlugNotAvailableError({ ctx }));
      }
    }

    switch (true) {
      case errors.length > 1:
        throw new AggregateError(errors);
      case errors.length === 1:
        throw errors[0];
    }
  }

  async isSlugAvailable(idCliente: number | undefined, cliente: Pick<CreateCliente | UpdateCliente, 'tenant'>) {
    return (
      (await this.tenantsRepository.countBy({
        idCliente: idCliente ? Not(idCliente) : undefined,
        slug: cliente.tenant?.slug,
      })) === 0
    );
  }
}

export const SlugNotAvailableErrorDef = {
  statusCode: 400,
  code: `SLUG_NOT_AVAILABLE`,
  message: `Slug '{slug}' is not available.`,
  ctx: z.object({
    slug: z.string(),
  }),
};
export class SlugNotAvailableError extends NamedSingleErrorWithCtx(SlugNotAvailableErrorDef) {}
