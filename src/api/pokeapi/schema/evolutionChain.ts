import { z } from 'zod';
import { NamedApiResource } from './namedApiResource';

type ChainLink = {
    species: { name: string; url: string };
    evolves_to: ChainLink[];
  };

const ChainLinkSchema: z.ZodType<ChainLink> = z.lazy(() =>
  z.object({
    species: NamedApiResource,
    evolves_to: z.array(ChainLinkSchema),
  }),
);

export const EvolutionChainSchema = z.object({
  id: z.number().optional(),
  chain: ChainLinkSchema,
});

export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
