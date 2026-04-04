import { z } from 'zod';

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

export const EvolutionChainSchema = z.object({
  id: z.number().optional(),
  chain: EvolutionChainLinkSchema,
});

export type EvolutionChain = {
  id?: number;
  chain: EvolutionChainLink;
};
