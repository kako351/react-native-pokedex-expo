import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePokemonDetail, usePokemonSpecies } from '@/src/api/pokeapi/queries';
import {
  pickJapaneseFlavorText,
  pickJapaneseName,
} from '@/src/api/pokeapi/pokemonSpeciesMapper';

const padNo = (id: number) => `#${String(id).padStart(4, '0')}`;
const toMeters = (dm: number) => `${(dm / 10).toFixed(1)} m`;
const toKg = (hg: number) => `${(hg / 10).toFixed(1)} kg`;

// 種族値の表示順と日本語ラベル
const STAT_LABEL: Record<string, string> = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ',
};

// 色は今のUIのまま固定（レイアウト維持）
const STAT_COLOR: Record<string, string> = {
  hp: '#e46c6c',
  attack: '#e29345',
  defense: '#d1a642',
  'special-attack': '#4d8ddb',
  'special-defense': '#4cb27b',
  speed: '#8f73d9',
};

// タイプ表示はまず英語→日本語の簡易変換（必要最低限）
const TYPE_JA: Record<string, string> = {
  grass: 'くさ',
  poison: 'どく',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  normal: 'ノーマル',
  fairy: 'フェアリー',
  flying: 'ひこう',
  bug: 'むし',
  ground: 'じめん',
  rock: 'いわ',
  psychic: 'エスパー',
  ice: 'こおり',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fighting: 'かくとう',
  ghost: 'ゴースト',
};

type TypeItem = {
  key: string;
  label: string;
};

type BaseStatItem = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type InfoCardProps = {
  title: string;
  right?: ReactNode;
  children: ReactNode;
};

function InfoCard({ title, right, children }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Text style={styles.blockTitle}>{title}</Text>
        {right ?? null}
      </View>
      {children}
    </View>
  );
}

type InfoGridItemProps = {
  label: string;
  value: string;
};

function InfoGridItem({ label, value }: InfoGridItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoKey}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

type TypeChipsProps = {
  items: TypeItem[];
};

function TypeChips({ items }: TypeChipsProps) {
  return (
    <View style={styles.typeRow}>
      {items.map((item) => (
        <View
          key={item.key}
          style={[styles.typeChip, { backgroundColor: '#f5f7fb' }]}
        >
          <Text style={[styles.typeText, { color: '#5f6672' }]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

type StatRowProps = {
  stat: BaseStatItem;
};

function StatRow({ stat }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{stat.label}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(stat.value / 1.4, 100)}%`,
              backgroundColor: stat.color,
            },
          ]}
        />
      </View>
    </View>
  );
}

type MoveChipsProps = {
  moves: string[];
};

function MoveChips({ moves }: MoveChipsProps) {
  return (
    <View style={styles.moveWrap}>
      {moves.map((move) => (
        <View key={move} style={styles.moveChip}>
          <Text style={styles.moveLabel}>{move}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PokemonDetailMockScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const pokemonName = name ?? '';

  const detailQ = usePokemonDetail(pokemonName);
  const speciesQ = usePokemonSpecies(pokemonName);

  if (detailQ.isLoading || speciesQ.isLoading) {
    return (
      <View style={[styles.page, { justifyContent: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (detailQ.isError) {
    return (
      <View style={[styles.page, { padding: 18 }]}>
        <Text>detail error: {(detailQ.error as Error).message}</Text>
      </View>
    );
  }

  if (speciesQ.isError) {
    return (
      <View style={[styles.page, { padding: 18 }]}>
        <Text>species error: {(speciesQ.error as Error).message}</Text>
      </View>
    );
  }

  const p = detailQ.data!;
  const s = speciesQ.data!;

  // --- 表示用に整形（UIを崩さないためにここで全部作る） ---
  const displayNo = padNo(p.id);
  const displayName = pickJapaneseName(s); // 日本語名（speciesから）
  const description =
    pickJapaneseFlavorText(s) ?? '図鑑説明が見つかりませんでした';

  const heroImageUri =
    p.sprites.other?.['official-artwork']?.front_default ??
    p.sprites.front_default ??
    '';

  const types = p.types
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((t) => ({
      key: t.type.name,
      label: TYPE_JA[t.type.name] ?? t.type.name,
    }));

  const baseStats = p.stats
    .map((st) => ({
      key: st.stat.name,
      label: STAT_LABEL[st.stat.name] ?? st.stat.name,
      value: st.base_stat,
      color: STAT_COLOR[st.stat.name] ?? '#4d8ddb',
    }))
    // 表示順を固定（UIの並びを守る）
    .sort(
      (a, b) =>
        [
          'hp',
          'attack',
          'defense',
          'special-attack',
          'special-defense',
          'speed',
        ].indexOf(a.key) -
        [
          'hp',
          'attack',
          'defense',
          'special-attack',
          'special-defense',
          'speed',
        ].indexOf(b.key),
    );

  const heightText = toMeters(p.height);
  const weightText = toKg(p.weight);

  const abilityText =
    p.abilities
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((a) => a.ability.name) // ここは英語。日本語化は追加APIが必要
      .join(' / ') || '-';

  const expText = String(p.base_experience ?? '-');

  const moveList = p.moves.slice(0, 4).map((m) => m.move.name); // 英語。日本語化は追加APIが必要

  // ------------------------------------------------------------

  return (
    <View style={styles.page}>
      <View style={styles.bgA} />
      <View style={styles.bgB} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.no}>{displayNo}</Text>
              <Text style={styles.name}>{displayName}</Text>

              <TypeChips items={types} />
            </View>
          </View>

          <View style={styles.heroImageStage}>
            <View style={styles.heroGlow} />
            {heroImageUri ? (
              <Image
                source={{ uri: heroImageUri }}
                contentFit="contain"
                transition={200}
                style={styles.heroImage}
              />
            ) : null}
          </View>
        </View>

        <InfoCard
          title="プロフィール"
          right={
            <MaterialIcons name="favorite-border" size={20} color="#7c838f" />
          }
        >
          <Text style={styles.description}>{description}</Text>
          <View style={styles.infoGrid}>
            <InfoGridItem label="たかさ" value={heightText} />
            <InfoGridItem label="おもさ" value={weightText} />
            <InfoGridItem label="とくせい" value={abilityText} />
            <InfoGridItem label="けいけんち" value={expText} />
          </View>
        </InfoCard>

        <InfoCard title="種族値">
          <View style={styles.statsWrap}>
            {baseStats.map((stat) => (
              <StatRow key={stat.key} stat={stat} />
            ))}
          </View>
        </InfoCard>

        {/* 進化ラインは別API（evolution-chain）が必要なので、UI維持のため今は固定表示のまま */}
        <InfoCard title="進化ライン">
          <View style={styles.evolutionRow}>
            <Text style={styles.evoName}>ヒトカゲ</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#8c92a0" />
            <Text style={styles.evoName}>リザード</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#8c92a0" />
            <Text style={[styles.evoName, styles.evoCurrent]}>リザードン</Text>
          </View>
        </InfoCard>

        <InfoCard title="覚えるわざ">
          <MoveChips moves={moveList} />
        </InfoCard>
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
