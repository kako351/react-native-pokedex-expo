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
import { pokeApiEndpoints } from './endpoints';
import { EvolutionChainSchema } from './schema/evolutionChain';
import { AbilitySchema, type Ability } from './schema/ability';
import { MoveSchema, type Move } from './schema/move';
import { PokemonTypeSchema, type PokemonType } from './schema/pokemontype';

/**
 * GET /pokemon
 */
export async function fetchPokemonList(params: {
  limit: number;
  offset: number;
}): Promise<PokemonList> {
  const res = await http.get(pokeApiEndpoints.pokemon, { params });
  return PokemonListSchema.parse(res.data);
}

/**
 * GET /pokemon/{name}
 */
export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const res = await http.get(
    `${pokeApiEndpoints.pokemon}/${encodeURIComponent(name)}`,
  );
  return PokemonDetailSchema.parse(res.data);
}

/**
 * GET /pokemon-species/{name}
 */
export async function fetchPokemonSpecies(
  name: string,
): Promise<PokemonSpecies> {
  const res = await http.get(
    `${pokeApiEndpoints.pokemonSpecies}/${encodeURIComponent(name)}`,
  );
  return PokemonSpeciesSchema.parse(res.data);
}

/**
 * GET /evolution-chain
 * 進化ラインの取得
 */
export async function fetchEvolutionChain(url: string) {
  const res = await http.get(url);
  return EvolutionChainSchema.parse(res.data);
}

/**
 * GET /ability/{id or name}
 */
export async function fetchAbility(url: string): Promise<Ability> {
  const res = await http.get(url);
  return AbilitySchema.parse(res.data);
}

/**
 * GET /move/{id or name}
 */
export async function fetchMove(url: string): Promise<Move> {
  const res = await http.get(url);
  return MoveSchema.parse(res.data);
}

/**
 * GET /type/{id or name}
 */
export async function fetchPokemonType(typeName: string): Promise<PokemonType> {
  const res = await http.get(
    `${pokeApiEndpoints.type}/${encodeURIComponent(typeName)}`,
  );
  return PokemonTypeSchema.parse(res.data);
}
