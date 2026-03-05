import { z } from 'zod';

export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number(),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.string(),
        url: z.string(),
      }),
    }),
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: z.object({
        name: z.string(),
        url: z.string(),
      }),
    }),
  ),
  abilities: z.array(
    z.object({
      is_hidden: z.boolean(),
      slot: z.number(),
      ability: z.object({
        name: z.string(),
        url: z.string(),
      }),
    }),
  ),
  moves: z.array(
    z.object({
      move: z.object({
        name: z.string(),
        url: z.string(),
      }),
    }),
  ),
  sprites: z.object({
    front_default: z.string().nullable(),
    other: z
      .object({
        'official-artwork': z
          .object({
            front_default: z.string().nullable(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
