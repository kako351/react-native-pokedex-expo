import { z } from 'zod';

export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.string(),
        url: z.string(),
      }),
    }),
  ),
  sprites: z.object({
    front_default: z.string().nullable(),
    other: z
      .object({
        'official-artwork': z.object({
          front_default: z.string().nullable(),
        }),
      })
      .partial()
      .optional(),
  }),
});

export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
