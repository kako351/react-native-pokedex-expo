import { pickJapaneseName } from '@/src/api/pokeapi/pokemonSpeciesMapper';
import type { PokemonSpecies } from '@/src/api/pokeapi/types';
import type { PokemonListItem } from '@/src/features/pokedex/model/pokemonListItem';

export const toPokemonDisplayNo = (id: number) =>
  `#${String(id).padStart(4, '0')}`;

export const toPokemonArtworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const extractPokemonIdFromResourceUrl = (url: string): number => {
  const matched = url.match(/\/pokemon\/(\d+)\//);
  if (!matched) {
    return 0;
  }
  return Number(matched[1]);
};

export const buildPokemonListItemModel = (
  name: string,
  resourceUrl: string,
  species?: PokemonSpecies,
): PokemonListItem => {
  const id = extractPokemonIdFromResourceUrl(resourceUrl);
  const displayName = species ? pickJapaneseName(species) : name;

  return {
    id,
    name,
    displayName,
    displayNo: toPokemonDisplayNo(id),
    imageUrl: toPokemonArtworkUrl(id),
  };
};
