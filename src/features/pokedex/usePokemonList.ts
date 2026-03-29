import {
  usePokemonListInfinite,
  usePokemonType,
  useSpeciesQueries,
} from '@/src/api/pokeapi/queries';
import {
  buildPokemonListItemModel,
  extractPokemonIdFromResourceUrl,
} from '@/src/features/pokedex/mappers/pokedexListMapper';
import type { PokemonListItem } from '@/src/features/pokedex/model/pokemonListItem';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PER_PAGE = 30;

export function usePokemonList(perPage = PER_PAGE, selectedType?: string) {
  const isTypeFilterActive = !!selectedType;
  const [typePage, setTypePage] = useState(1);
  const [isTypeFetchingNextPage, setIsTypeFetchingNextPage] = useState(false);

  useEffect(() => {
    setTypePage(1);
    setIsTypeFetchingNextPage(false);
  }, [selectedType]);

  const q = usePokemonListInfinite(perPage, !isTypeFilterActive);
  const typeQ = usePokemonType(selectedType);
  const rawFromList = useMemo(
    () => q.data?.pages.flatMap((page) => page.results) ?? [],
    [q.data?.pages],
  );
  const rawFromTypeAll = useMemo(() => {
    if (!typeQ.data) {
      return [];
    }

    return typeQ.data.pokemon
      .map((entry) => entry.pokemon)
      .sort(
        (a, b) =>
          extractPokemonIdFromResourceUrl(a.url) -
          extractPokemonIdFromResourceUrl(b.url),
      );
  }, [typeQ.data]);
  const rawFromType = useMemo(
    () => rawFromTypeAll.slice(0, typePage * perPage),
    [rawFromTypeAll, typePage, perPage],
  );
  const hasNextTypePage = rawFromType.length < rawFromTypeAll.length;
  const raw = isTypeFilterActive ? rawFromType : rawFromList;
  const names = raw.map((resource) => resource.name);

  const speciesQueries = useSpeciesQueries(names);
  const isSpeciesLoading = speciesQueries.some(
    (speciesQ) => speciesQ.isLoading,
  );

  useEffect(() => {
    if (isTypeFetchingNextPage && !isSpeciesLoading) {
      setIsTypeFetchingNextPage(false);
    }
  }, [isTypeFetchingNextPage, isSpeciesLoading]);

  const fetchNextTypePage = useCallback(async () => {
    if (!hasNextTypePage || isTypeFetchingNextPage) {
      return;
    }

    setIsTypeFetchingNextPage(true);
    setTypePage((prev) => prev + 1);
  }, [hasNextTypePage, isTypeFetchingNextPage]);

  const items: PokemonListItem[] = useMemo(() => {
    return raw.map((resource, idx) => {
      const species = speciesQueries[idx]?.data;
      return buildPokemonListItemModel(resource.name, resource.url, species);
    });
  }, [raw, speciesQueries]);

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

export type { PokemonListItem };
