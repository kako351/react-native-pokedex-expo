import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const BASE_STATS = [
  { label: 'HP', value: 78, color: '#e46c6c' },
  { label: 'こうげき', value: 84, color: '#e29345' },
  { label: 'ぼうぎょ', value: 78, color: '#d1a642' },
  { label: 'とくこう', value: 109, color: '#4d8ddb' },
  { label: 'とくぼう', value: 85, color: '#4cb27b' },
  { label: 'すばやさ', value: 100, color: '#8f73d9' },
];

const MOVE_LIST = ['かえんほうしゃ', 'ドラゴンクロー', 'エアスラッシュ', 'はねやすめ'];
const HERO_IMAGE_URI =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png';

export default function PokemonDetailMockScreen() {
  return (
    <View style={styles.page}>
      <View style={styles.bgA} />
      <View style={styles.bgB} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.no}>#0006</Text>
              <Text style={styles.name}>リザードン</Text>
              <View style={styles.typeRow}>
                <View style={[styles.typeChip, { backgroundColor: '#f6c89c' }]}>
                  <Text style={[styles.typeText, { color: '#8a4e20' }]}>ほのお</Text>
                </View>
                <View style={[styles.typeChip, { backgroundColor: '#c9defb' }]}>
                  <Text style={[styles.typeText, { color: '#2e5f9b' }]}>ひこう</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.heroImageStage}>
            <View style={styles.heroGlow} />
            <Image
              source={{ uri: HERO_IMAGE_URI }}
              contentFit="contain"
              transition={200}
              style={styles.heroImage}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.blockTitle}>プロフィール</Text>
            <MaterialIcons name="favorite-border" size={20} color="#7c838f" />
          </View>
          <Text style={styles.description}>
            つよい つばさで こうくうし、たかい ねつの ほのおを はきだす。ここはAPI接続後に図鑑説明文を表示。
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoKey}>たかさ</Text>
              <Text style={styles.infoValue}>1.7 m</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoKey}>おもさ</Text>
              <Text style={styles.infoValue}>90.5 kg</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoKey}>とくせい</Text>
              <Text style={styles.infoValue}>もうか</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoKey}>けいけんち</Text>
              <Text style={styles.infoValue}>267</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.blockTitle}>種族値</Text>
          <View style={styles.statsWrap}>
            {BASE_STATS.map((stat) => (
              <View key={stat.label} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.min(stat.value / 1.4, 100)}%`, backgroundColor: stat.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.blockTitle}>進化ライン</Text>
          <View style={styles.evolutionRow}>
            <Text style={styles.evoName}>ヒトカゲ</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#8c92a0" />
            <Text style={styles.evoName}>リザード</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#8c92a0" />
            <Text style={[styles.evoName, styles.evoCurrent]}>リザードン</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.blockTitle}>覚えるわざ</Text>
          <View style={styles.moveWrap}>
            {MOVE_LIST.map((move) => (
              <View key={move} style={styles.moveChip}>
                <Text style={styles.moveLabel}>{move}</Text>
              </View>
            ))}
          </View>
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
  bgA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#ffe4da',
    top: -100,
    left: -85,
    opacity: 0.7,
  },
  bgB: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#dce9ff',
    top: 200,
    right: -105,
    opacity: 0.6,
  },
  content: {
    paddingTop: 72,
    paddingHorizontal: 18,
    paddingBottom: 110,
    gap: 12,
  },
  hero: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efe7d8',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  no: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7c838f',
  },
  name: {
    marginTop: 2,
    fontSize: 34,
    fontWeight: '900',
    color: '#1f242d',
    letterSpacing: 0.4,
  },
  typeRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: '#ef7544',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeLabel: {
    color: '#fffcf5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroImageStage: {
    marginTop: 8,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#fff2ea',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#ffc8ad',
    top: -10,
    opacity: 0.65,
  },
  heroImage: {
    width: '92%',
    height: '92%',
  },
  infoCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efe7d8',
    padding: 15,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#232732',
  },
  description: {
    fontSize: 13,
    lineHeight: 21,
    color: '#5d6470',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f8f4eb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 3,
  },
  infoKey: {
    fontSize: 11,
    color: '#838b99',
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 15,
    color: '#252936',
    fontWeight: '800',
  },
  statsWrap: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    color: '#646b78',
    fontWeight: '700',
  },
  statValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    color: '#252936',
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#ece7db',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  evolutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  evoName: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f7fb',
    color: '#5f6672',
    fontSize: 13,
    fontWeight: '700',
  },
  evoCurrent: {
    backgroundColor: '#ffe9df',
    color: '#9e4f2b',
  },
  moveWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moveChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e3dde0',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  moveLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5d6470',
  },
});
