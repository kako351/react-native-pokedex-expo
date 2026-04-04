import { z } from 'zod';
import { PokemonDetail as GeneratedPokemonDetail } from '../generated/schema/index.zod';

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

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
};
