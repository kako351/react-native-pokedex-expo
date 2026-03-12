import { pickJapaneseName } from '@/src/api/pokeapi/pokemonSpeciesMapper';
import {
  usePokemonListInfinite,
  usePokemonType,
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

const noOpFetchNextPage = async () => undefined;

export function usePokemonList(perPage = PER_PARGE, selectedType?: string) {
  const isTypeFilterActive = !!selectedType;
  const q = usePokemonListInfinite(perPage, !isTypeFilterActive);
  const typeQ = usePokemonType(selectedType);
  const rawFromList = useMemo(
    () => q.data?.pages.flatMap((p) => p.results) ?? [],
    [q.data?.pages],
  );
  const rawFromType = useMemo(() => {
    if (!typeQ.data) return [];
    return typeQ.data.pokemon
      .map((entry) => entry.pokemon)
      .sort((a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url));
  }, [typeQ.data]);
  const raw = isTypeFilterActive ? rawFromType : rawFromList;
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
    isLoading: isTypeFilterActive ? typeQ.isLoading : q.isLoading,
    isError: isTypeFilterActive ? typeQ.isError : q.isError,
    error: isTypeFilterActive ? typeQ.error : q.error,
    fetchNextPage: isTypeFilterActive ? noOpFetchNextPage : q.fetchNextPage,
    hasNextPage: isTypeFilterActive ? false : q.hasNextPage,
    isFetchingNextPage: isTypeFilterActive ? false : q.isFetchingNextPage,
    refetch: isTypeFilterActive ? typeQ.refetch : q.refetch,
  };
}
