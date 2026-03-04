import { usePokemonListInfinite } from '@/src/api/pokeapi/queries';
import { useMemo } from 'react';

export type PokemonListItem = {
  id: number;
  name: string;
  displayNo: string;
};

const PER_PARGE: number = 30;

const padNo = (id: number) => `#${String(id).padStart(4, '0')}`;

const extractIdFromUrl = (url: string): number => {
  // 例: https://pokeapi.co/api/v2/pokemon/25/  -> 25
  const m = url.match(/\/pokemon\/(\d+)\//);
  if (!m) return 0;
  return Number(m[1]);
};

export function usePokemonList(perPage = PER_PARGE) {
  const q = usePokemonListInfinite(perPage);

  const items: PokemonListItem[] = useMemo(() => {
    const raw = q.data?.pages.flatMap((p) => p.results) ?? [];
    return raw.map((p) => {
      const id = extractIdFromUrl(p.url);
      return {
        id,
        name: p.name,
        displayNo: padNo(id),
      };
    });
  }, [q.data]);

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
