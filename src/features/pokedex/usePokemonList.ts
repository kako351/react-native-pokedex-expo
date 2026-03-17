import { pickJapaneseName } from '@/src/api/pokeapi/pokemonSpeciesMapper';
import {
  usePokemonListInfinite,
  usePokemonType,
  useSpeciesQueries,
} from '@/src/api/pokeapi/queries';
import { useEffect, useState } from 'react';

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

export function usePokemonList(perPage = PER_PARGE, selectedType?: string) {
  const isTypeFilterActive = !!selectedType;
  const [typePage, setTypePage] = useState(1);
  const [isTypeFetchingNextPage, setIsTypeFetchingNextPage] = useState(false);

  useEffect(() => {
    setTypePage(1);
    setIsTypeFetchingNextPage(false);
  }, [selectedType]);

  const q = usePokemonListInfinite(perPage, !isTypeFilterActive);
  const typeQ = usePokemonType(selectedType);

  // PERF-ISSUE: useMemo を除去 — 毎レンダリングで flatMap 実行
  const rawFromList = q.data?.pages.flatMap((p) => p.results) ?? [];

  // PERF-ISSUE: useMemo を除去 — 毎レンダリングでソート実行
  const rawFromTypeAll = (() => {
    if (!typeQ.data) return [];
    return typeQ.data.pokemon
      .map((entry) => entry.pokemon)
      .sort((a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url));
  })();

  // PERF-ISSUE: useMemo を除去 — 毎レンダリングで slice 実行
  const rawFromType = rawFromTypeAll.slice(0, typePage * perPage);

  const hasNextTypePage = rawFromType.length < rawFromTypeAll.length;
  const raw = isTypeFilterActive ? rawFromType : rawFromList;
  const names = raw.map((r) => r.name);

  const speciesQueries = useSpeciesQueries(names);
  const isSpeciesLoading = speciesQueries.some(
    (speciesQ) => speciesQ.isLoading,
  );

  useEffect(() => {
    if (isTypeFetchingNextPage && !isSpeciesLoading) {
      setIsTypeFetchingNextPage(false);
    }
  }, [isTypeFetchingNextPage, isSpeciesLoading]);

  // PERF-ISSUE: useCallback を除去 — 毎レンダリングで新しい関数参照生成
  const fetchNextTypePage = async () => {
    if (!hasNextTypePage || isTypeFetchingNextPage) return;
    setIsTypeFetchingNextPage(true);
    setTypePage((prev) => prev + 1);
  };

  // PERF-ISSUE: useMemo を除去 — 毎レンダリングで items 変換を実行
  const items: PokemonListItem[] = raw.map((p, idx) => {
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

  return {
    items,
    isLoading: isTypeFilterActive
      ? typeQ.isLoading || isSpeciesLoading
      : q.isLoading,
    isError: isTypeFilterActive ? typeQ.isError : q.isError,
    error: isTypeFilterActive ? typeQ.error : q.error,
    fetchNextPage: isTypeFilterActive ? fetchNextTypePage : q.fetchNextPage,
    hasNextPage: isTypeFilterActive ? hasNextTypePage : q.hasNextPage,
    isFetchingNextPage: isTypeFilterActive
      ? isTypeFetchingNextPage
      : q.isFetchingNextPage,
    refetch: isTypeFilterActive ? typeQ.refetch : q.refetch,
  };
}
