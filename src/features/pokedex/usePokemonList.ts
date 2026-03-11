import { pickJapaneseName } from '@/src/api/pokeapi/pokemonSpeciesMapper';
import {
  usePokemonListInfinite,
  useSpeciesQueries,
} from '@/src/api/pokeapi/queries';
import { useMemo } from 'react';

export type PokemonListItem = {
  id: number;
  name: string;
  displayName: string;
  displayNo: string;
  imageUrl: string;
};

const PER_PARGE: number = 30;

const padNo = (id: number) => `#${String(id).padStart(4, '0')}`;

const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const extractIdFromUrl = (url: string): number => {
  // 例: https://pokeapi.co/api/v2/pokemon/25/  -> 25
  const m = url.match(/\/pokemon\/(\d+)\//);
  if (!m) return 0;
  return Number(m[1]);
};

export function usePokemonList(perPage = PER_PARGE) {
  const q = usePokemonListInfinite(perPage);
  const raw = useMemo(
    () => q.data?.pages.flatMap((p) => p.results) ?? [],
    [q.data?.pages],
  );
  const names = raw.map((r) => r.name);

  const speciesQueries = useSpeciesQueries(names);

  const items: PokemonListItem[] = useMemo(() => {
    return raw.map((p, idx) => {
      const id = extractIdFromUrl(p.url);
      const species = speciesQueries[idx]?.data;
      const displayName = species ? pickJapaneseName(species) : p.name;
      return {
        id,
        name: p.name,
        displayName: displayName,
        displayNo: padNo(id),
        imageUrl: artworkUrl(id),
      };
    });
  }, [raw, speciesQueries]);

  return {
    items,
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    fetchNextPage: q.fetchNextPage,
    hasNextPage: q.hasNextPage,
    isFetchingNextPage: q.isFetchingNextPage,
    refetch: q.refetch,
  };
}
