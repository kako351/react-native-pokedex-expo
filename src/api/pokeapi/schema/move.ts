import { z } from 'zod';
import { NamedApiResource } from './namedApiResource';

export const MoveSchema = z.object({
  name: z.string(),
  names: z.array(
    z.object({
      name: z.string(),
      language: NamedApiResource,
    }),
  ),
});

export type Move = z.infer<typeof MoveSchema>;
