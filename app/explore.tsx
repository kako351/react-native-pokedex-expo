import { PokemonDetailScreenView } from '@/components/features/pokedex/PokemonDetailScreenView';
import { usePokemonDetailScreen } from '@/src/features/pokedex/usePokemonDetailScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const INITIAL_MOVE_COUNT = 4;
const MOVE_PAGE_SIZE = 8;

export default function PokemonDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const pokemonName = name ?? '';
  const [visibleMoveCount, setVisibleMoveCount] = useState(INITIAL_MOVE_COUNT);
  const screenQ = usePokemonDetailScreen(pokemonName, visibleMoveCount);

  useEffect(() => {
    setVisibleMoveCount(INITIAL_MOVE_COUNT);
  }, [pokemonName]);

  if (screenQ.isLoading) {
    return (
      <View style={[styles.page, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (screenQ.isError) {
    return (
      <View style={[styles.page, styles.errorContainer]}>
        <Text>error: {screenQ.error?.message ?? 'unknown'}</Text>
      </View>
    );
  }

  if (!screenQ.data) {
    return (
      <View style={[styles.page, styles.errorContainer]}>
        <Text>データが見つかりませんでした。</Text>
      </View>
    );
  }

  const canShowMoreMoves =
    screenQ.data.moveList.length < screenQ.data.moveTotalCount;

  return (
    <PokemonDetailScreenView
      data={screenQ.data}
      canShowMoreMoves={canShowMoreMoves}
      onBack={() => router.back()}
      onPressMoreMoves={() =>
        setVisibleMoveCount((prev) => prev + MOVE_PAGE_SIZE)
      }
    />
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fffdf7',
  },
  center: {
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 18,
  },
});
