import { BOON_DATASOURCE } from '@boon/backend/database';
import { BoonTemplateClientiEntity } from '@boon/backend/database/entities/boon';
import { NamedSingleErrorWithCtx } from '@boon/common/core';
import { CreateTemplate, UpdateTemplate } from '@boon/interfaces/boon-api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { z } from 'zod';

@Injectable()
export class TemplateValidationService {
  constructor(
    @InjectRepository(BoonTemplateClientiEntity, BOON_DATASOURCE)
    private readonly templateClientiRepository: Repository<BoonTemplateClientiEntity>
  ) {}

  async checkPreValidity(idTemplate: number | undefined, idCliente: number, dto: CreateTemplate | UpdateTemplate) {
    const errors = [];

    if (dto.nome !== undefined) {
      const isNameAvailable = await this.isNameAvailable(idTemplate, idCliente, dto);
      if (!isNameAvailable) {
        const ctx = { nome: dto.nome };
        errors.push(new TemplateNameNotAvailableError({ ctx }));
      }
    }

    switch (true) {
      case errors.length > 1:
        throw new AggregateError(errors);
      case errors.length === 1:
        throw errors[0];
    }
  }

  async isNameAvailable(idTemplate: number | undefined, idCliente: number, template: Pick<CreateTemplate | UpdateTemplate, 'nome'>) {
    return (
      (await this.templateClientiRepository.countBy({
        id: idTemplate ? Not(idTemplate) : undefined,
        idCliente: idCliente,
        nome: template.nome,
      })) === 0
    );
  }
}

export const TemplateNameNotAvailableErrorDef = {
  statusCode: 400,
  code: `TEMPLATE_NAME_NOT_AVAILABLE`,
  message: `Template name '{nome}' is not available.`,
  ctx: z.object({
    nome: z.string(),
  }),
};
export class TemplateNameNotAvailableError extends NamedSingleErrorWithCtx(TemplateNameNotAvailableErrorDef) {}
