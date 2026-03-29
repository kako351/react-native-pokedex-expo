import {
  filterPokemonListByKeyword,
  normalizePokemonSearchKeyword,
} from '@/src/features/pokedex/pokemonSearch';
import { usePokemonList } from '@/src/features/pokedex/usePokemonList';
import { useMemo, useState } from 'react';

export function usePokedexListScreen() {
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined,
  );
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    items,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonList(undefined, selectedType);

  const isTypeFiltering = !!selectedType;
  const showInlineListLoading = isTypeFiltering && isLoading;
  const showInlineListError = isTypeFiltering && isError;
  const normalizedKeyword = normalizePokemonSearchKeyword(searchKeyword);

  const filteredItems = useMemo(
    () => filterPokemonListByKeyword(items, searchKeyword),
    [items, searchKeyword],
  );

  const showSearchEmpty =
    !isLoading &&
    !isError &&
    normalizedKeyword.length > 0 &&
    filteredItems.length === 0;

  return {
    selectedType,
    setSelectedType,
    searchKeyword,
    setSearchKeyword,
    filteredItems,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    showInlineListLoading,
    showInlineListError,
    showSearchEmpty,
    onEndReached: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    isTypeFiltering,
  };
}
