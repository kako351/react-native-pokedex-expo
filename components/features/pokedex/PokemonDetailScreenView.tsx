import type { PokemonDetailScreenData } from '@/src/features/pokedex/usePokemonDetailScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GameRadar } from '@kako351/react-native-game-radar';
import { Image } from 'expo-image';
import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
        <View key={item.key} style={styles.typeChip}>
          <Text style={styles.typeText}>{item.label}</Text>
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

type PokemonDetailScreenViewProps = {
  data: PokemonDetailScreenData;
  canShowMoreMoves: boolean;
  onBack: () => void;
  onPressMoreMoves: () => void;
};

export function PokemonDetailScreenView({
  data,
  canShowMoreMoves,
  onBack,
  onPressMoreMoves,
}: PokemonDetailScreenViewProps) {
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
    backgroundColor: `rgba(10, 16, 30, ${interpolate(
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
    evolutionNames,
  } = data;

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
            <View style={styles.heroBadge}>
              <MaterialIcons name="sports-esports" size={14} color="#9af0ff" />
              <Text style={styles.heroBadgeLabel}>BATTLE DATA</Text>
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
          onPress={onBack}
          hitSlop={10}
          style={styles.toolbarBackButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="#e6f1ff" />
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
            <MaterialIcons name="favorite-border" size={20} color="#9ab0d2" />
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
                      background: '#111c34',
                      gridColor: '#2a3e61',
                      axisColor: '#2a3e61',
                      areaFill: 'rgba(46, 214, 255, 0.30)',
                      areaStroke: '#2ed6ff',
                      glowColor: 'rgba(56, 189, 248, 0.0)',
                      labelColor: '#9cb2d4',
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
                      color="#92a8cb"
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
            <Pressable onPress={onPressMoreMoves} style={styles.moreButton}>
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
    backgroundColor: '#0b1020',
  },
  bgA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#173864',
    top: -100,
    left: -85,
    opacity: 0.72,
  },
  bgB: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#4a1f47',
    top: 200,
    right: -105,
    opacity: 0.64,
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
    backgroundColor: '#121a30',
    borderWidth: 1,
    borderColor: '#2a3a59',
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
    color: '#89a4cb',
  },
  name: {
    marginTop: 2,
    fontSize: 34,
    fontWeight: '900',
    color: '#e8f1ff',
    letterSpacing: 0.6,
  },
  typeRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2b4469',
    backgroundColor: '#13233e',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b7cbeb',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2ed6ff',
    backgroundColor: '#11253f',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeLabel: {
    color: '#9af0ff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroImageStage: {
    marginTop: 8,
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2a3d61',
    backgroundColor: 'rgba(16, 26, 48, 0.7)',
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
    borderBottomColor: '#304669',
  },
  toolbarBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2f4a70',
    backgroundColor: '#121e36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#e9f2ff',
  },
  toolbarRightSpace: {
    width: 36,
    height: 36,
  },
  infoCard: {
    borderRadius: 18,
    backgroundColor: '#121a30',
    borderWidth: 1,
    borderColor: '#2a3a59',
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
    color: '#e9f2ff',
  },
  description: {
    fontSize: 13,
    lineHeight: 21,
    color: '#a4b8d7',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#101a30',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#283a5a',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 3,
  },
  infoKey: {
    fontSize: 11,
    color: '#8fa7ca',
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 15,
    color: '#e3ecfb',
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
    backgroundColor: '#111c34',
    borderWidth: 1,
    borderColor: '#294061',
    padding: 8,
  },
  radarFallbackText: {
    fontSize: 12,
    color: '#8ea5c8',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    color: '#94acd1',
    fontWeight: '700',
  },
  statValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    color: '#e3ecfb',
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2b3d5f',
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
    borderWidth: 1,
    borderColor: '#2c4469',
    backgroundColor: '#13233f',
    color: '#adc3e4',
    fontSize: 13,
    fontWeight: '700',
  },
  evoCurrent: {
    borderColor: '#2ed6ff',
    backgroundColor: '#163560',
    color: '#dff8ff',
  },
  moveWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moveChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2d4368',
    backgroundColor: '#13223e',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  moveLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#adc3e4',
  },
  moreButton: {
    alignSelf: 'center',
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2ed6ff',
    backgroundColor: '#15355b',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  moreButtonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#dcf9ff',
  },
});
