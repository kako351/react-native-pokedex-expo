import { PokedexListScreenView } from '@/src/features/pokedex/components/PokedexListScreenView';
import { usePokedexListScreen } from '@/src/features/pokedex/hooks/usePokedexListScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function PokedexListScreenContainer() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screen = usePokedexListScreen();

  return (
    <PokedexListScreenView
      isDark={isDark}
      items={screen.filteredItems}
      selectedType={screen.selectedType}
      onSelectType={screen.setSelectedType}
      searchKeyword={screen.searchKeyword}
      onChangeSearchKeyword={screen.setSearchKeyword}
      isTypeFiltering={screen.isTypeFiltering}
      isLoading={screen.isLoading}
      isError={screen.isError}
      error={screen.error as Error | null}
      isFetchingNextPage={screen.isFetchingNextPage}
      onEndReached={screen.onEndReached}
      showInlineListLoading={screen.showInlineListLoading}
      showInlineListError={screen.showInlineListError}
      showSearchEmpty={screen.showSearchEmpty}
    />
  );
}
