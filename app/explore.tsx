import {
  usePokemonDetailScreen,
  type PokemonDetailScreenData,
} from '@/src/features/pokedex/usePokemonDetailScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GameRadar } from '@kako351/react-native-game-radar';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Component, useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

type TypeItem = PokemonDetailScreenData['types'][number];
type BaseStatItem = PokemonDetailScreenData['baseStats'][number];

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

type RadarBoundaryProps = {
  children: ReactNode;
};

type RadarBoundaryState = {
  hasError: boolean;
};

class RadarBoundary extends Component<RadarBoundaryProps, RadarBoundaryState> {
  state: RadarBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('GameRadar render error', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text style={styles.radarFallbackText}>
          レーダーグラフを表示できませんでした。
        </Text>
      );
    }

    return this.props.children;
  }
}

const EXPANDED_HEADER_HEIGHT = 480;
const COLLAPSED_HEADER_HEIGHT = 92;
const COLLAPSE_RANGE = EXPANDED_HEADER_HEIGHT - COLLAPSED_HEADER_HEIGHT;
const INITIAL_MOVE_COUNT = 4;
const MOVE_PAGE_SIZE = 8;

export default function PokemonDetailMockScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const pokemonName = name ?? '';
  const [visibleMoveCount, setVisibleMoveCount] = useState(INITIAL_MOVE_COUNT);
  const screenQ = usePokemonDetailScreen(pokemonName, visibleMoveCount);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, COLLAPSE_RANGE],
      [EXPANDED_HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT],
      Extrapolation.CLAMP,
    ),
  }));

  const heroBodyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [0, COLLAPSE_RANGE * 0.7],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [0, COLLAPSE_RANGE],
          [0, -28],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const toolbarAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 253, 247, ${interpolate(
      scrollOffset.value,
      [0, COLLAPSE_RANGE * 0.85],
      [0, 1],
      Extrapolation.CLAMP,
    )})`,
    borderBottomWidth: interpolate(
      scrollOffset.value,
      [0, COLLAPSE_RANGE * 0.85],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const toolbarTitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [COLLAPSE_RANGE * 0.55, COLLAPSE_RANGE * 0.9],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [COLLAPSE_RANGE * 0.55, COLLAPSE_RANGE * 0.9],
          [8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  useEffect(() => {
    setVisibleMoveCount(INITIAL_MOVE_COUNT);
  }, [pokemonName]);

  if (screenQ.isLoading) {
    return (
      <View style={[styles.page, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (screenQ.isError) {
    return (
      <View style={[styles.page, { padding: 18 }]}>
        <Text>error: {screenQ.error?.message ?? 'unknown'}</Text>
      </View>
    );
  }

  if (!screenQ.data) {
    return (
      <View style={[styles.page, { padding: 18 }]}>
        <Text>データが見つかりませんでした。</Text>
      </View>
    );
  }
  const {
    displayNo,
    displayName,
    heroImageUri,
    types,
    description,
    heightText,
    weightText,
    abilityText,
    expText,
    baseStats,
    moveList,
    moveTotalCount,
    evolutionNames,
  } = screenQ.data;

  const canShowMoreMoves = moveList.length < moveTotalCount;
  const radarAxes = baseStats.map((stat) => ({
    label: stat.label,
    value: stat.value,
    maxValue: 180,
  }));

  return (
    <View style={styles.page}>
      <View style={styles.bgA} />
      <View style={styles.bgB} />

      <Animated.View style={[styles.heroContainer, heroAnimatedStyle]}>
        <Animated.View style={[styles.heroBody, heroBodyAnimatedStyle]}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.no}>{displayNo}</Text>
              <Text style={styles.name}>{displayName}</Text>
              <TypeChips items={types} />
            </View>
          </View>

          <View style={styles.heroImageStage}>
            {heroImageUri ? (
              <Image
                source={{ uri: heroImageUri }}
                contentFit="contain"
                transition={200}
                style={styles.heroImage}
              />
            ) : null}
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.toolbar, toolbarAnimatedStyle]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.toolbarBackButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="#2f3440" />
        </Pressable>
        <Animated.Text style={[styles.toolbarTitle, toolbarTitleAnimatedStyle]}>
          {displayName}
        </Animated.Text>
        <View style={styles.toolbarRightSpace} />
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
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
            <View style={styles.radarWrap}>
              <RadarBoundary>
                <View style={styles.radarSurface}>
                  <GameRadar
                    axes={radarAxes}
                    size={280}
                    rings={0}
                    showLabels
                    showGrid={false}
                    animated={false}
                    theme={{
                      background: '#ffffff',
                      gridColor: '#ededed',
                      axisColor: '#ededed',
                      areaFill: 'rgba(56, 189, 248, 0.24)',
                      areaStroke: '#38bdf8',
                      glowColor: 'rgba(56, 189, 248, 0.0)',
                      labelColor: '#5f6672',
                    }}
                  />
                </View>
              </RadarBoundary>
            </View>
          </View>
        </InfoCard>

        <InfoCard title="進化ライン">
          <View style={styles.evolutionRow}>
            {evolutionNames.length > 0 ? (
              evolutionNames.map((evo, idx) => (
                <View key={evo} style={styles.evolutionItem}>
                  {idx > 0 ? (
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      color="#8c92a0"
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.evoName,
                      evo === displayName ? styles.evoCurrent : null,
                    ]}
                  >
                    {evo}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.description}>
                進化情報が見つかりませんでした。
              </Text>
            )}
          </View>
        </InfoCard>

        <InfoCard title="覚えるわざ">
          <MoveChips moves={moveList} />
          {canShowMoreMoves ? (
            <Pressable
              onPress={() =>
                setVisibleMoveCount((prev) => prev + MOVE_PAGE_SIZE)
              }
              style={styles.moreButton}
            >
              <Text style={styles.moreButtonLabel}>もっと見る</Text>
            </Pressable>
          ) : null}
        </InfoCard>
      </Animated.ScrollView>
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
    paddingTop: EXPANDED_HEADER_HEIGHT + 0,
    paddingHorizontal: 18,
    paddingBottom: 110,
    gap: 12,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    overflow: 'hidden',
  },
  heroBody: {
    paddingTop: 72,
    paddingHorizontal: 18,
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
    marginTop: 32,
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: COLLAPSED_HEADER_HEIGHT,
    paddingTop: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#efe7d8',
  },
  toolbarBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#232732',
  },
  toolbarRightSpace: {
    width: 36,
    height: 36,
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
  radarWrap: {
    marginTop: 10,
    alignItems: 'center',
  },
  radarSurface: {
    borderRadius: 12,
    padding: 6,
  },
  radarFallbackText: {
    fontSize: 12,
    color: '#7c838f',
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
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  evolutionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  moreButton: {
    alignSelf: 'center',
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9d1c6',
    backgroundColor: '#fffaf2',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  moreButtonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5d6470',
  },
});
