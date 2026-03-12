import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';

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

const CARD_BG_COLORS = [
  '#edf1f7',
  '#ffe9de',
  '#dfecff',
  '#ddf6ea',
  '#fff4cf',
  '#f0e7ff',
  '#fde9e4',
  '#e8f0ff',
] as const;

const TYPE_BG_BY_FILTER: Record<string, string> = {
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

export default function PokedexScreen() {
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined,
  );
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
        <FlatList
          data={items}
          numColumns={2}
          extraData={selectedType}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <ListHeader
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />
          }
          contentContainerStyle={styles.content}
          columnWrapperStyle={styles.cardRow}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="large" style={styles.footerLoader} />
            ) : null
          }
          ListEmptyComponent={
            showInlineListLoading ? (
              <ActivityIndicator size="large" style={styles.inlineLoader} />
            ) : showInlineListError ? (
              <Text style={styles.inlineErrorText}>
                エラーが発生しました:{' '}
                {error instanceof Error ? error.message : 'unknown'}
              </Text>
            ) : null
          }
          renderItem={({ item, index }) => (
            <PokemonCard
              item={item}
              isLeft={index % 2 === 0}
              selectedType={selectedType}
            />
          )}
        />
      )}
    </View>
  );
}

type ListHeaderProps = {
  selectedType?: string;
  onSelectType: (type?: string) => void;
};

function ListHeader({ selectedType, onSelectType }: ListHeaderProps) {
  return (
    <>
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

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color="#8a8f98" />
        <TextInput
          editable={false}
          placeholder="ポケモン名・図鑑番号で検索"
          placeholderTextColor="#8a8f98"
          style={styles.searchInput}
        />
        <MaterialIcons name="tune" size={20} color="#8a8f98" />
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
  item: PokemonListItem;
  isLeft: boolean;
  selectedType?: string;
};

function PokemonCard({ item, isLeft, selectedType }: PokemonCardProps) {
  const backgroundColor = selectedType
    ? (TYPE_BG_BY_FILTER[selectedType] ?? '#edf1f7')
    : CARD_BG_COLORS[(Math.max(item.id, 1) - 1) % CARD_BG_COLORS.length];

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

const styles = StyleSheet.create({
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
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardCell: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
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
  cardLeft: {
    marginRight: 6,
  },
  cardRight: {
    marginLeft: 6,
  },
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
