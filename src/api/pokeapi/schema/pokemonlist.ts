import { PaginatedPokemonSummaryList } from '../generated/schema/index.zod';

export const PokemonListSchema = PaginatedPokemonSummaryList;

export type PokemonList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};
