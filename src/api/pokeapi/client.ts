import { http } from '@/src/lib/axios';
import {
  PokemonDetailSchema,
  PokemonSpeciesSchema,
  PokemonListSchema,
  EvolutionChainSchema,
  AbilitySchema,
  MoveSchema,
  PokemonTypeSchema,
} from './parsers';
import { pokeApiEndpoints } from './endpoints';
import type {
  Ability,
  EvolutionChain,
  Move,
  PokemonDetail,
  PokemonList,
  PokemonSpecies,
  PokemonType,
} from './types';

const toPokemonList = (data: any): PokemonList => ({
  count: data.count ?? 0,
  next: data.next ?? null,
  previous: data.previous ?? null,
  results: data.results ?? [],
});

const toPokemonDetail = (data: any): PokemonDetail => ({
  id: data.id,
  name: data.name,
  height: data.height ?? 0,
  weight: data.weight ?? 0,
  base_experience: data.base_experience ?? 0,
  types: data.types ?? [],
  stats: data.stats ?? [],
  abilities: data.abilities ?? [],
  moves: data.moves ?? [],
  sprites: {
    front_default: data.sprites?.front_default ?? null,
    other: data.sprites?.other,
  },
});

const toEvolutionChainLink = (data: any): EvolutionChain['chain'] => ({
  species: {
    name: data?.species?.name ?? '',
    url: data?.species?.url ?? '',
  },
  evolves_to: Array.isArray(data?.evolves_to)
    ? data.evolves_to.map(toEvolutionChainLink)
    : [],
});

const toEvolutionChain = (data: any): EvolutionChain => ({
  id: data.id,
  chain: toEvolutionChainLink(data.chain),
});

const toPokemonType = (data: any): PokemonType => ({
  id: data.id,
  name: data.name,
  pokemon: Array.isArray(data.pokemon)
    ? data.pokemon.map((entry: any) => ({
        pokemon: {
          name: entry?.pokemon?.name ?? '',
          url: entry?.pokemon?.url ?? '',
        },
        slot: entry?.slot ?? 0,
      }))
    : [],
});

/**
 * GET /pokemon
 */
export async function fetchPokemonList(params: {
  limit: number;
  offset: number;
}): Promise<PokemonList> {
  const res = await http.get(pokeApiEndpoints.pokemon, { params });
  return toPokemonList(PokemonListSchema.parse(res.data));
}

/**
 * GET /pokemon/{name}
 */
export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const res = await http.get(
    `${pokeApiEndpoints.pokemon}/${encodeURIComponent(name)}`,
  );
  return toPokemonDetail(PokemonDetailSchema.parse(res.data));
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
  EvolutionChainSchema.parse(res.data);
  return toEvolutionChain(res.data);
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
  return toPokemonType(PokemonTypeSchema.parse(res.data));
}
