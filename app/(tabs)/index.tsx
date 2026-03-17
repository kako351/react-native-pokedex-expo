import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMemo, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  filterPokemonListByKeyword,
  normalizePokemonSearchKeyword,
} from '@/src/features/pokedex/pokemonSearch';
import {
  type PokemonListItem,
  usePokemonList,
} from '@/src/features/pokedex/usePokemonList';

type FilterType = {
  label: string;
  value?: string;
};

const FILTER_TYPES: FilterType[] = [
  { label: 'すべて' },
  { label: 'ノーマル', value: 'normal' },
  { label: 'くさ', value: 'grass' },
  { label: 'ほのお', value: 'fire' },
  { label: 'みず', value: 'water' },
  { label: 'でんき', value: 'electric' },
  { label: 'こおり', value: 'ice' },
  { label: 'かくとう', value: 'fighting' },
  { label: 'どく', value: 'poison' },
  { label: 'じめん', value: 'ground' },
  { label: 'ひこう', value: 'flying' },
  { label: 'エスパー', value: 'psychic' },
  { label: 'むし', value: 'bug' },
  { label: 'いわ', value: 'rock' },
  { label: 'ゴースト', value: 'ghost' },
  { label: 'ドラゴン', value: 'dragon' },
  { label: 'あく', value: 'dark' },
  { label: 'はがね', value: 'steel' },
  { label: 'フェアリー', value: 'fairy' },
];

const LIGHT_CARD_BG_COLORS = [
  '#edf1f7',
  '#ffe9de',
  '#dfecff',
  '#ddf6ea',
  '#fff4cf',
  '#f0e7ff',
  '#fde9e4',
  '#e8f0ff',
] as const;

const DARK_CARD_BG_COLORS = [
  '#1a2a46',
  '#3d233b',
  '#153659',
  '#1b3d4a',
  '#4a3922',
  '#2f2850',
  '#4b2633',
  '#23334f',
] as const;

const LIGHT_TYPE_BG_BY_FILTER: Record<string, string> = {
  normal: '#f7ecde',
  grass: '#ddf6ea',
  fire: '#ffe9de',
  water: '#dfecff',
  electric: '#fff4cf',
  ice: '#e2f8fd',
  fighting: '#fde9e4',
  poison: '#f0e7ff',
  ground: '#f8efd9',
  flying: '#e8f0ff',
  psychic: '#ffe6ef',
  bug: '#edf8db',
  rock: '#eee8df',
  ghost: '#eee9ff',
  dragon: '#e6e9ff',
  dark: '#ececf1',
  steel: '#e6eef3',
  fairy: '#ffe2f2',
};

const DARK_TYPE_BG_BY_FILTER: Record<string, string> = {
  normal: '#2b3340',
  grass: '#193d3b',
  fire: '#4a2c2f',
  water: '#15395c',
  electric: '#4d4322',
  ice: '#18424a',
  fighting: '#4b2b3a',
  poison: '#352a54',
  ground: '#473a2b',
  flying: '#243f65',
  psychic: '#492b4e',
  bug: '#2c4121',
  rock: '#3b3733',
  ghost: '#2f3050',
  dragon: '#262f5f',
  dark: '#252833',
  steel: '#2a3848',
  fairy: '#4a2d43',
};

export default function PokedexScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

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

  const filteredItems = useMemo(() => {
    return filterPokemonListByKeyword(items, searchKeyword);
  }, [items, searchKeyword]);

  const showSearchEmpty =
    !isLoading &&
    !isError &&
    normalizedKeyword.length > 0 &&
    filteredItems.length === 0;

  return (
    <View style={styles.page}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />

      {!isTypeFiltering && isLoading ? (
        <ActivityIndicator size="large" style={styles.centerLoader} />
      ) : !isTypeFiltering && isError ? (
        <Text style={styles.errorText}>
          エラーが発生しました:{' '}
          {error instanceof Error ? error.message : 'unknown'}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              e.nativeEvent;
            const isNearEnd =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 500;
            if (isNearEnd && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          scrollEventThrottle={16}
        >
          <ListHeader
            isDark={isDark}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            searchKeyword={searchKeyword}
            onChangeSearchKeyword={setSearchKeyword}
          />
          {showInlineListLoading ? (
            <ActivityIndicator size="large" style={styles.inlineLoader} />
          ) : showInlineListError ? (
            <Text style={styles.inlineErrorText}>
              エラーが発生しました:{' '}
              {error instanceof Error ? error.message : 'unknown'}
            </Text>
          ) : showSearchEmpty ? (
            <Text style={styles.inlineErrorText}>
              {`「${searchKeyword.trim()}」に一致するポケモンが見つかりませんでした。`}
            </Text>
          ) : (
            <View style={styles.gridContainer}>
              {filteredItems.map((item, index) => (
                <PokemonCard
                  key={item.id.toString()}
                  isDark={isDark}
                  item={item}
                  isLeft={index % 2 === 0}
                  selectedType={selectedType}
                />
              ))}
            </View>
          )}
          {isFetchingNextPage ? (
            <ActivityIndicator size="large" style={styles.footerLoader} />
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

type ListHeaderProps = {
  isDark: boolean;
  selectedType?: string;
  onSelectType: (type?: string) => void;
  searchKeyword: string;
  onChangeSearchKeyword: (value: string) => void;
};

function ListHeader({
  isDark,
  selectedType,
  onSelectType,
  searchKeyword,
  onChangeSearchKeyword,
}: ListHeaderProps) {
  const styles = isDark ? darkStyles : lightStyles;
  const iconColor = isDark ? '#7d90b1' : '#8a8f98';

  return (
    <>
      {isDark ? (
        <View style={styles.headerPanel}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Pokédex</Text>
            <Text style={styles.subtitle}>図鑑スキャンを開始しよう</Text>
            <View style={styles.missionBadge}>
              <Text style={styles.missionBadgeLabel}>MISSION 151+</Text>
            </View>
          </View>
          <View style={styles.ball}>
            <View style={styles.ballInner} />
          </View>
        </View>
      ) : (
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Pokédex</Text>
            <Text style={styles.subtitle}>
              見つけたポケモンをコレクションしよう
            </Text>
          </View>
          <View style={styles.ball}>
            <View style={styles.ballInner} />
          </View>
        </View>
      )}

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color={iconColor} />
        <TextInput
          testID="pokemon-search-input"
          value={searchKeyword}
          onChangeText={onChangeSearchKeyword}
          placeholder="ポケモン名・図鑑番号で検索"
          placeholderTextColor={iconColor}
          style={styles.searchInput}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <MaterialIcons name="tune" size={20} color={iconColor} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_TYPES.map((type) => {
          const isActive =
            type.value === selectedType || (!type.value && !selectedType);
          return (
            <TouchableOpacity
              key={type.label}
              onPress={() =>
                onSelectType(
                  type.value === selectedType ? undefined : type.value,
                )
              }
              activeOpacity={0.8}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}

type PokemonCardProps = {
  isDark: boolean;
  item: PokemonListItem;
  isLeft: boolean;
  selectedType?: string;
};

function PokemonCard({ item, isDark, isLeft, selectedType }: PokemonCardProps) {
  const styles = isDark ? darkStyles : lightStyles;
  const typeBackground = isDark
    ? DARK_TYPE_BG_BY_FILTER
    : LIGHT_TYPE_BG_BY_FILTER;
  const cardBackgrounds = isDark ? DARK_CARD_BG_COLORS : LIGHT_CARD_BG_COLORS;

  const backgroundColor = selectedType
    ? (typeBackground[selectedType] ?? '#edf1f7')
    : cardBackgrounds[(Math.max(item.id, 1) - 1) % cardBackgrounds.length];

  return (
    <View
      style={[
        styles.cardCell,
        isLeft ? styles.cardLeft : styles.cardRight,
        { backgroundColor },
      ]}
    >
      <Link
        href={{ pathname: '/explore', params: { name: item.name } }}
        asChild
      >
        <Pressable
          testID={`pokemon-card-${item.name}`}
          android_ripple={{
            color: 'rgba(31, 36, 45, 0.16)',
            foreground: true,
          }}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardNo}>{item.displayNo}</Text>
            <View style={styles.avatar}>
              <Image
                source={{ uri: item.imageUrl }}
                contentFit="contain"
                contentPosition="center"
                transition={150}
                style={styles.pokemonImage}
              />
            </View>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.displayName}
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fffdf7',
  },
  bgOrbTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffd8cc',
    top: -120,
    right: -110,
    opacity: 0.6,
  },
  bgOrbBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#d8ecff',
    bottom: -80,
    left: -90,
    opacity: 0.55,
  },
  content: {
    paddingTop: 74,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  centerLoader: {
    marginTop: 120,
  },
  footerLoader: {
    marginTop: 16,
  },
  inlineLoader: {
    marginTop: 24,
  },
  errorText: {
    marginTop: 120,
    paddingHorizontal: 18,
  },
  inlineErrorText: {
    marginTop: 24,
    paddingHorizontal: 18,
  },
  headerPanel: {},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#222326',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6f7580',
  },
  missionBadge: {
    display: 'none',
  },
  missionBadgeLabel: {
    display: 'none',
  },
  ball: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#1f242d',
    backgroundColor: '#f15d5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1f242d',
  },
  searchBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ebe3d6',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: '#8a8f98',
    fontSize: 14,
  },
  filterRow: {
    marginTop: 14,
    gap: 8,
    paddingRight: 32,
  },
  filterScroll: {
    marginHorizontal: -18,
    paddingLeft: 16,
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e1ddcf',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    borderColor: '#1f242d',
    backgroundColor: '#1f242d',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666d78',
  },
  filterLabelActive: {
    color: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardCell: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 186,
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardLeft: {},
  cardRight: {},
  cardNo: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#88909b',
    textAlign: 'right',
    fontWeight: '800',
  },
  avatar: {
    marginTop: 10,
    width: 84,
    height: 84,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#1f242d',
    lineHeight: 22,
  },
  pokemonImage: {
    width: '82%',
    height: '82%',
    alignSelf: 'center',
  },
});

const darkStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1020',
  },
  bgOrbTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#173864',
    top: -130,
    right: -90,
    opacity: 0.65,
  },
  bgOrbBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#4a1f47',
    bottom: -90,
    left: -100,
    opacity: 0.6,
  },
  content: {
    paddingTop: 74,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  centerLoader: {
    marginTop: 120,
  },
  footerLoader: {
    marginTop: 16,
  },
  inlineLoader: {
    marginTop: 24,
  },
  errorText: {
    marginTop: 120,
    paddingHorizontal: 18,
  },
  inlineErrorText: {
    marginTop: 24,
    paddingHorizontal: 18,
  },
  headerRow: {
    flex: 1,
    justifyContent: 'center',
  },
  headerPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2a3957',
    backgroundColor: '#121a30',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#e6f0ff',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#8aa0c2',
  },
  missionBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2ed6ff',
    backgroundColor: '#11253f',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  missionBadgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#6ee7ff',
  },
  ball: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#d8e7ff',
    backgroundColor: '#ff5b5b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e8f0ff',
    borderWidth: 2,
    borderColor: '#273b57',
  },
  searchBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a3b5c',
    backgroundColor: '#101a30',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: '#7d90b1',
    fontSize: 14,
  },
  filterRow: {
    marginTop: 14,
    gap: 8,
    paddingRight: 32,
  },
  filterScroll: {
    marginHorizontal: -18,
    paddingLeft: 16,
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#304769',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#101a30',
  },
  filterChipActive: {
    borderColor: '#2ed6ff',
    backgroundColor: '#15355b',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ab1d2',
  },
  filterLabelActive: {
    color: '#dff8ff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardCell: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a3d61',
    padding: 1,
    marginBottom: 0,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 186,
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardLeft: {},
  cardRight: {},
  cardNo: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#eef6ff',
    textAlign: 'right',
    fontWeight: '800',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(3, 7, 16, 0.8)',
    textShadowRadius: 6,
  },
  avatar: {
    marginTop: 10,
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: 'rgba(10, 15, 30, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '900',
    color: '#f5f9ff',
    lineHeight: 22,
    textShadowColor: 'rgba(3, 7, 16, 0.85)',
    textShadowRadius: 8,
  },
  pokemonImage: {
    width: '82%',
    height: '82%',
    alignSelf: 'center',
  },
});
