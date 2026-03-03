import { http } from '@/src/lib/axios';
import {
  PokemonDetailSchema,
  type PokemonDetail,
} from './schema/pokemondetail';
import { PokemonListSchema, type PokemonList } from './schema/pokemonlist';
import {
  PokemonSpeciesSchema,
  type PokemonSpecies,
} from './schema/pokemonspecies';

/**
 * GET /pokemon
 */
export async function fetchPokemonList(params: {
  limit: number;
  offset: number;
}): Promise<PokemonList> {
  const res = await http.get('/pokemon', { params });
  return PokemonListSchema.parse(res.data);
}

/**
 * GET /pokemon/{name}
 */
export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const res = await http.get(`/pokemon/${encodeURIComponent(name)}`);
  return PokemonDetailSchema.parse(res.data);
}

/**
 * GET /pokemon-species/{name}
 */
export async function fetchPokemonSpecies(
  name: string,
): Promise<PokemonSpecies> {
  const res = await http.get(`/pokemon-species/${encodeURIComponent(name)}`);
  return PokemonSpeciesSchema.parse(res.data);
}
