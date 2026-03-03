import { z } from "zod";

const NamedApiResource = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonSpeciesSchema = z.object({
  name: z.string(),
  names: z.array(
    z.object({
      name: z.string(),
      language: NamedApiResource,
    })
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: NamedApiResource,
    })
  ),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: NamedApiResource,
      version: NamedApiResource.optional(),
      version_group: NamedApiResource.optional(),
    })
  ),
});
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
