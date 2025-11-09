import {
  boonClientiSchema,
  boonComposizioneTemplateSchema,
  boonFunzionalitaSchema,
  boonStatiTemplateSchema,
  boonTemplateClientiSchema,
} from '@boon/interfaces/database';
import { z } from 'zod';
import { clienteResExcerptSchema } from '../clienti';
import { funzionalitaResExcerptSchema } from '../features';
import { statoTemplateResExcerptSchema } from './stati-template';

export const templateSchema = boonTemplateClientiSchema;
export type Template = z.infer<typeof templateSchema>;

export const templateResSchema = templateSchema
  .omit({
    idCliente: true,
    idStato: true,
    idFunzionalita: true,
  })
  .extend({
    cliente: clienteResExcerptSchema,
    stato: statoTemplateResExcerptSchema,
    funzionalita: funzionalitaResExcerptSchema,
    composizione: z.array(boonComposizioneTemplateSchema.omit({ idTemplate: true })),
  });
export type TemplateRes = z.infer<typeof templateResSchema>;

export const templateResExcerptSchema = templateResSchema
  .omit({
    cliente: true,
  })
  .extend({
    cliente: z.object({
      id: boonClientiSchema.shape.id,
      ragioneSociale: boonClientiSchema.shape.ragioneSociale,
    }),
  });
export type TemplateResExcerpt = z.infer<typeof templateResExcerptSchema>;

export const createTemplateSchema = boonTemplateClientiSchema
  .omit({
    id: true,
    idCliente: true,
    idStato: true,
    idFunzionalita: true,
  })
  .extend({
    funzionalita: z.object({
      id: boonFunzionalitaSchema.shape.id,
      nome: boonFunzionalitaSchema.shape.nome.optional(),
    }),
    stato: z.object({
      id: boonStatiTemplateSchema.shape.id,
      nome: boonStatiTemplateSchema.shape.nome.optional(),
    }),
    composizione: z.array(boonComposizioneTemplateSchema.omit({ id: true, idTemplate: true })),
  });
export type CreateTemplate = z.infer<typeof createTemplateSchema>;

export const updateTemplateSchema = createTemplateSchema
  .extend({
    funzionalita: createTemplateSchema.shape.funzionalita.optional(),
    stato: createTemplateSchema.shape.stato.optional(),
    composizione: createTemplateSchema.shape.composizione.optional(),
  })
  .partial();
export type UpdateTemplate = z.infer<typeof updateTemplateSchema>;
