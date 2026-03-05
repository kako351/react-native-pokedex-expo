import { z } from 'zod';
import { NamedApiResource } from './namedApiResource';

export const AbilitySchema = z.object({
  name: z.string(),
  names: z.array(
    z.object({
      name: z.string(),
      language: NamedApiResource,
    }),
  ),
});

export type Ability = z.infer<typeof AbilitySchema>;
