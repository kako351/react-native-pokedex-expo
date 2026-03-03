import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type PokemonCard = {
  id: number;
  name: string;
  displayNo: string;
  types: string[];
  accent: string;
  bg: string;
};

const MOCK_POKEMON: PokemonCard[] = [
  {
    id: 1,
    name: 'フシギダネ',
    displayNo: '#0001',
    types: ['くさ', 'どく'],
    accent: '#4f9c7d',
    bg: '#ddf6ea',
  },
  {
    id: 4,
    name: 'ヒトカゲ',
    displayNo: '#0004',
    types: ['ほのお'],
    accent: '#db6d3f',
    bg: '#ffe9de',
  },
  {
    id: 7,
    name: 'ゼニガメ',
    displayNo: '#0007',
    types: ['みず'],
    accent: '#4c82d9',
    bg: '#dfecff',
  },
  {
    id: 25,
    name: 'ピカチュウ',
    displayNo: '#0025',
    types: ['でんき'],
    accent: '#d7a62e',
    bg: '#fff4cf',
  },
  {
    id: 39,
    name: 'プリン',
    displayNo: '#0039',
    types: ['ノーマル', 'フェアリー'],
    accent: '#ba6d9a',
    bg: '#ffe2f2',
  },
  {
    id: 133,
    name: 'イーブイ',
    displayNo: '#0133',
    types: ['ノーマル'],
    accent: '#9a7a52',
    bg: '#f7ecde',
  },
];

const FILTER_TYPES = [
  'すべて',
  'くさ',
  'ほのお',
  'みず',
  'でんき',
  'ノーマル',
  'フェアリー',
];

export default function PokedexScreen() {
  return (
    <View style={styles.page}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.grid}>
          {MOCK_POKEMON.map((pokemon) => (
            <View
              key={pokemon.id}
              style={[styles.card, { backgroundColor: pokemon.bg }]}
            >
              <Text style={styles.cardNo}>{pokemon.displayNo}</Text>
              <View
                style={[styles.avatar, { backgroundColor: pokemon.accent }]}
              >
                <Text style={styles.avatarText}>{pokemon.name[0]}</Text>
              </View>
              <Text style={styles.cardName}>{pokemon.name}</Text>
              <View style={styles.typeRow}>
                {pokemon.types.map((type) => (
                  <View
                    key={`${pokemon.id}-${type}`}
                    style={[styles.typePill, { borderColor: pokemon.accent }]}
                  >
                    <Text style={[styles.typeText, { color: pokemon.accent }]}>
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    gap: 14,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    minHeight: 148,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  cardNo: {
    fontSize: 11,
    color: '#70767f',
    textAlign: 'right',
    fontWeight: '700',
  },
  avatar: {
    marginTop: 4,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  cardName: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#1f242d',
  },
  typeRow: {
    marginTop: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  typePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: '#ffffffcc',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
