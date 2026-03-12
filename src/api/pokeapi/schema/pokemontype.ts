import { z } from 'zod';
import { NamedApiResource } from './namedApiResource';

export const PokemonTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: NamedApiResource,
      slot: z.number(),
    }),
  ),
});

export type PokemonType = z.infer<typeof PokemonTypeSchema>;
