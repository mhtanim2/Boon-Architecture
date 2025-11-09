import { extendApi as s } from '@anatine/zod-openapi';
import { z } from 'zod';

const stringDateOnly = () =>
  s(
    z.string().refine(
      (val) => {
        return /^(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/.test(
          val as string
        );
      },
      { message: 'String is not in valid YYYY-MM-DD (ISO8601) format' }
    ),
    { format: 'date' }
  );

export const zc = {
  stringDateOnly: stringDateOnly,
};
