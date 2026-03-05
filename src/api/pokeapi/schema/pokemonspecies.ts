import { z } from 'zod';
import { NamedApiResource } from './namedApiResource';

export const PokemonSpeciesSchema = z.object({
  name: z.string(),

  evolution_chain: z.object({
    url: z.string(),
  }),

  names: z.array(
    z.object({
      name: z.string(),
      language: NamedApiResource,
    }),
  ),

  genera: z.array(
    z.object({
      genus: z.string(),
      language: NamedApiResource,
    }),
  ),

  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: NamedApiResource,
      version: NamedApiResource.optional(),
      version_group: NamedApiResource.optional(),
    }),
  ),
});

export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
