import {
  pickJapaneseFlavorText,
  pickJapaneseName,
} from '@/src/api/pokeapi/pokemonSpeciesMapper';
import {
  fetchAbility,
  fetchMove,
  fetchPokemonSpecies,
} from '@/src/api/pokeapi/client';
import {
  useEvolutionChain,
  usePokemonDetail,
  usePokemonSpecies,
} from '@/src/api/pokeapi/queries';
import { EvolutionChain } from '@/src/api/pokeapi/schema/evolutionChain';
import { PokemonDetail } from '@/src/api/pokeapi/schema/pokemondetail';
import { PokemonSpecies } from '@/src/api/pokeapi/schema/pokemonspecies';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

const padNo = (id: number) => `#${String(id).padStart(4, '0')}`;
const toMeters = (dm: number) => `${(dm / 10).toFixed(1)} m`;
const toKg = (hg: number) => `${(hg / 10).toFixed(1)} kg`;

const STAT_LABEL: Record<string, string> = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ',
};

const STAT_COLOR: Record<string, string> = {
  hp: '#e46c6c',
  attack: '#e29345',
  defense: '#d1a642',
  'special-attack': '#4d8ddb',
  'special-defense': '#4cb27b',
  speed: '#8f73d9',
};

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

const sortBySlot = <T extends { slot: number }>(a: T, b: T) => a.slot - b.slot;

const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

const flattenEvolutionChainNames = (chain: EvolutionChain): string[] => {
  const result: string[] = [];
  const stack = [chain.chain];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    result.push(current.species.name);

    for (let i = current.evolves_to.length - 1; i >= 0; i -= 1) {
      stack.push(current.evolves_to[i]);
    }
  }

  return result;
};

const pickJaLocalizedName = (
  names: { name: string; language: { name: string } }[],
  fallback: string,
) =>
  names.find((n) => n.language.name === 'ja')?.name ??
  names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
  fallback;

export type PokemonDetailScreenData = {
  displayNo: string;
  displayName: string;
  heroImageUri: string;

  types: { key: string; label: string }[];

  description: string;

  heightText: string;
  weightText: string;
  abilityText: string;
  expText: string;

  baseStats: { key: string; label: string; value: number; color: string }[];

  moveList: string[];
  moveTotalCount: number;
  evolutionNames: string[];
};

export function usePokemonDetailScreen(name: string, moveLimit = 4) {
  const safeName = name?.trim() ?? '';

  const detailQ = usePokemonDetail(safeName);
  const speciesQ = usePokemonSpecies(safeName);
  const evolutionUrl = speciesQ.data?.evolution_chain?.url;
  const evoQ = useEvolutionChain(evolutionUrl);
  const evolutionRawNames = useMemo(
    () => (evoQ.data ? flattenEvolutionChainNames(evoQ.data) : []),
    [evoQ.data],
  );
  const evolutionSpeciesQueries = useQueries({
    queries: evolutionRawNames.map((evoName) => ({
      queryKey: ['pokemon', 'species', evoName] as const,
      queryFn: () => fetchPokemonSpecies(evoName),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });
  const abilityResources = useMemo(
    () =>
      detailQ.data?.abilities
        .slice()
        .sort(sortBySlot)
        .map((a) => a.ability) ?? [],
    [detailQ.data],
  );
  const abilityQueries = useQueries({
    queries: abilityResources.map((ability) => ({
      queryKey: ['pokemon', 'ability', ability.url] as const,
      queryFn: () => fetchAbility(ability.url),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });
  const moveResources = useMemo(
    () => detailQ.data?.moves.slice(0, moveLimit).map((m) => m.move) ?? [],
    [detailQ.data, moveLimit],
  );
  const moveQueries = useQueries({
    queries: moveResources.map((move) => ({
      queryKey: ['pokemon', 'move', move.url] as const,
      queryFn: () => fetchMove(move.url),
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });
  const isEvolutionSpeciesLoading = evolutionSpeciesQueries.some(
    (q) => q.isLoading,
  );
  const evolutionSpeciesError =
    evolutionSpeciesQueries.find((q) => q.isError)?.error ?? null;
  const isAbilityLoading = abilityQueries.some((q) => q.isLoading);
  const abilityError = abilityQueries.find((q) => q.isError)?.error ?? null;
  const isMoveLoading = moveQueries.some((q) => q.isLoading);
  const moveError = moveQueries.find((q) => q.isError)?.error ?? null;

  const isLoading =
    detailQ.isLoading ||
    speciesQ.isLoading ||
    evoQ.isLoading ||
    isEvolutionSpeciesLoading ||
    isAbilityLoading ||
    isMoveLoading;
  const isError =
    detailQ.isError ||
    speciesQ.isError ||
    evoQ.isError ||
    !!evolutionSpeciesError ||
    !!abilityError ||
    !!moveError;
  const error = (detailQ.error ??
    speciesQ.error ??
    evoQ.error ??
    evolutionSpeciesError ??
    abilityError ??
    moveError) as Error | null;

  const data: PokemonDetailScreenData | null = useMemo(() => {
    const p: PokemonDetail | undefined = detailQ.data;
    const s: PokemonSpecies | undefined = speciesQ.data;
    if (!p || !s) return null;

    const evolutionNames = evolutionRawNames.map((evoName, idx) => {
      const species = evolutionSpeciesQueries[idx]?.data;
      return species ? pickJapaneseName(species) : evoName;
    });

    const heroImageUri =
      p.sprites.other?.['official-artwork']?.front_default ??
      p.sprites.front_default ??
      '';

    const types = p.types
      .slice()
      .sort(sortBySlot)
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
      .sort((a, b) => STAT_ORDER.indexOf(a.key) - STAT_ORDER.indexOf(b.key));

    const abilityText =
      abilityResources
        .map((ability, idx) => {
          const abilityData = abilityQueries[idx]?.data;
          return abilityData
            ? pickJaLocalizedName(abilityData.names, ability.name)
            : ability.name;
        })
        .join(' / ') || '-';

    const moveList = moveResources.map((move, idx) => {
      const moveData = moveQueries[idx]?.data;
      return moveData
        ? pickJaLocalizedName(moveData.names, move.name)
        : move.name;
    });

    return {
      displayNo: padNo(p.id),
      displayName: pickJapaneseName(s),
      heroImageUri,

      types,

      description:
        pickJapaneseFlavorText(s) ?? '図鑑説明が見つかりませんでした',

      heightText: toMeters(p.height),
      weightText: toKg(p.weight),
      abilityText,
      expText: String(p.base_experience ?? '-'),

      baseStats,
      moveList,
      moveTotalCount: p.moves.length,
      evolutionNames,
    };
  }, [
    detailQ.data,
    speciesQ.data,
    evolutionRawNames,
    evolutionSpeciesQueries,
    abilityResources,
    abilityQueries,
    moveResources,
    moveQueries,
  ]);

  return {
    isLoading,
    isError,
    error,
    data,
  };
}
