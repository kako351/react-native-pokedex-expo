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
  View,
} from 'react-native';

import {
  type PokemonListItem,
  usePokemonList,
} from '@/src/features/pokedex/usePokemonList';

const FILTER_TYPES = [
  'すべて',
  'くさ',
  'ほのお',
  'みず',
  'でんき',
  'ノーマル',
  'フェアリー',
];

const DEFAULT_CARD_THEME = { accent: '#5f6672', bg: '#edf1f7' } as const;

const CARD_THEME_BY_TYPE: Record<string, { accent: string; bg: string }> = {
  grass: { accent: '#4f9c7d', bg: '#ddf6ea' },
  poison: { accent: '#8a63b8', bg: '#f0e7ff' },
  fire: { accent: '#db6d3f', bg: '#ffe9de' },
  water: { accent: '#4c82d9', bg: '#dfecff' },
  electric: { accent: '#d7a62e', bg: '#fff4cf' },
  normal: { accent: '#9a7a52', bg: '#f7ecde' },
  fairy: { accent: '#ba6d9a', bg: '#ffe2f2' },
  flying: { accent: '#6d8ec9', bg: '#e8f0ff' },
  bug: { accent: '#72983a', bg: '#edf8db' },
  ground: { accent: '#aa8b4b', bg: '#f8efd9' },
  rock: { accent: '#8e8171', bg: '#eee8df' },
  psychic: { accent: '#d95f8a', bg: '#ffe6ef' },
  ice: { accent: '#58a8bb', bg: '#e2f8fd' },
  dragon: { accent: '#5a6bc9', bg: '#e6e9ff' },
  dark: { accent: '#5a5a62', bg: '#ececf1' },
  steel: { accent: '#6e8595', bg: '#e6eef3' },
  fighting: { accent: '#bf5b48', bg: '#fde9e4' },
  ghost: { accent: '#7a6ab6', bg: '#eee9ff' },
};

function getCardTheme(primaryType: string | null) {
  if (!primaryType) return DEFAULT_CARD_THEME;
  return CARD_THEME_BY_TYPE[primaryType] ?? DEFAULT_CARD_THEME;
}

export default function PokedexScreen() {
  const {
    items,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonList();

  return (
    <View style={styles.page}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.centerLoader} />
      ) : isError ? (
        <Text style={styles.errorText}>
          エラーが発生しました:{' '}
          {error instanceof Error ? error.message : 'unknown'}
        </Text>
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
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
          renderItem={({ item, index }) => (
            <PokemonCard item={item} isLeft={index % 2 === 0} />
          )}
        />
      )}
    </View>
  );
}

function ListHeader() {
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
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_TYPES.map((type, idx) => (
          <View
            key={type}
            style={[styles.filterChip, idx === 0 && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterLabel,
                idx === 0 && styles.filterLabelActive,
              ]}
            >
              {type}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>No.001 - No.151</Text>
        <Text style={styles.sectionMeta}>151匹</Text>
      </View>
    </>
  );
}

type PokemonCardProps = {
  item: PokemonListItem;
  isLeft: boolean;
};

function PokemonCard({ item, isLeft }: PokemonCardProps) {
  const theme = getCardTheme(item.primaryType);
  return (
    <View
      style={[
        styles.cardCell,
        isLeft ? styles.cardLeft : styles.cardRight,
        { backgroundColor: theme.bg },
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
            <View style={styles.typeRow}>
              {item.typeLabels.map((typeLabel) => (
                <View
                  key={`${item.id}-${typeLabel}`}
                  style={[styles.typePill, { borderColor: theme.accent }]}
                >
                  <Text style={[styles.typeText, { color: theme.accent }]}>
                    {typeLabel}
                  </Text>
                </View>
              ))}
            </View>
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
  errorText: {
    marginTop: 120,
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
    paddingRight: 12,
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
  sectionHeader: {
    marginTop: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f242d',
  },
  sectionMeta: {
    fontSize: 13,
    color: '#6f7580',
    fontWeight: '700',
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
  typeRow: {
    marginTop: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: '#ffffffcc',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pokemonImage: {
    width: '82%',
    height: '82%',
    alignSelf: 'center',
  },
});
