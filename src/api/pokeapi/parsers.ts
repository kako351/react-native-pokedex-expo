import { z } from 'zod';
import {
  AbilityDetail,
  MoveDetail,
  PaginatedPokemonSummaryList,
  PokemonDetail as GeneratedPokemonDetail,
  PokemonSpeciesDetail,
  TypeDetail,
} from './generated/schema/index.zod';

type EvolutionChainLink = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
};

const EvolutionChainLinkSchema: z.ZodType<EvolutionChainLink> = z.lazy(() =>
  z.object({
    species: z.object({
      name: z.string(),
      url: z.string().url(),
    }),
    evolves_to: z.array(EvolutionChainLinkSchema),
  }),
);

export const PokemonListSchema = PaginatedPokemonSummaryList;

export const PokemonDetailSchema = GeneratedPokemonDetail.pick({
  id: true,
  name: true,
  height: true,
  weight: true,
  base_experience: true,
  types: true,
  stats: true,
  abilities: true,
  moves: true,
}).extend({
  sprites: z.object({
    front_default: z.string().nullable().optional(),
    other: z
      .object({
        'official-artwork': z
          .object({
            front_default: z.string().nullable().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const PokemonSpeciesSchema = PokemonSpeciesDetail.pick({
  name: true,
  evolution_chain: true,
  names: true,
  genera: true,
  flavor_text_entries: true,
});

export const EvolutionChainSchema = z.object({
  id: z.number().optional(),
  chain: EvolutionChainLinkSchema,
});

export const AbilitySchema = AbilityDetail.pick({
  name: true,
  names: true,
});

export const MoveSchema = MoveDetail.pick({
  name: true,
  names: true,
});

export const PokemonTypeSchema = TypeDetail.pick({
  id: true,
  name: true,
  pokemon: true,
});
