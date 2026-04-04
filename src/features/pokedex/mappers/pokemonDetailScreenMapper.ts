import {
  pickJapaneseFlavorText,
  pickJapaneseName,
} from '@/src/api/pokeapi/pokemonSpeciesMapper';
import type {
  EvolutionChain,
  PokemonDetail,
  PokemonSpecies,
} from '@/src/api/pokeapi/types';
import type { PokemonDetailScreenData } from '@/src/features/pokedex/model/pokemonDetailScreenData';
import { toJapaneseTypeLabel } from '@/src/features/pokedex/pokemonTypeLabel';

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

const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

const sortBySlot = <T extends { slot: number }>(a: T, b: T) => a.slot - b.slot;

export const toPokemonDisplayNo = (id: number) =>
  `#${String(id).padStart(4, '0')}`;

export const toPokemonHeightText = (dm: number) => `${(dm / 10).toFixed(1)} m`;

export const toPokemonWeightText = (hg: number) => `${(hg / 10).toFixed(1)} kg`;

export const flattenEvolutionChainNames = (chain: EvolutionChain): string[] => {
  const result: string[] = [];
  const stack = [chain.chain];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    result.push(current.species.name);

    for (let i = current.evolves_to.length - 1; i >= 0; i -= 1) {
      stack.push(current.evolves_to[i]);
    }
  }

  return result;
};

export const pickJaLocalizedName = (
  names: { name: string; language: { name: string } }[],
  fallback: string,
) =>
  names.find((entry) => entry.language.name === 'ja')?.name ??
  names.find((entry) => entry.language.name === 'ja-Hrkt')?.name ??
  fallback;

type BuildPokemonDetailScreenModelInput = {
  detail: PokemonDetail;
  species: PokemonSpecies;
  evolutionNames: string[];
  abilityNames: string[];
  moveList: string[];
};

export const buildPokemonDetailScreenModel = ({
  detail,
  species,
  evolutionNames,
  abilityNames,
  moveList,
}: BuildPokemonDetailScreenModelInput): PokemonDetailScreenData => {
  const heroImageUri =
    detail.sprites.other?.['official-artwork']?.front_default ??
    detail.sprites.front_default ??
    '';

  const types = detail.types
    .slice()
    .sort(sortBySlot)
    .map((item) => ({
      key: item.type.name,
      label: toJapaneseTypeLabel(item.type.name),
    }));

  const baseStats = detail.stats
    .map((stat) => ({
      key: stat.stat.name,
      label: STAT_LABEL[stat.stat.name] ?? stat.stat.name,
      value: stat.base_stat,
      color: STAT_COLOR[stat.stat.name] ?? '#4d8ddb',
    }))
    .sort((a, b) => STAT_ORDER.indexOf(a.key) - STAT_ORDER.indexOf(b.key));

  return {
    displayNo: toPokemonDisplayNo(detail.id),
    displayName: pickJapaneseName(species),
    heroImageUri,
    types,
    description:
      pickJapaneseFlavorText(species) ?? '図鑑説明が見つかりませんでした',
    heightText: toPokemonHeightText(detail.height),
    weightText: toPokemonWeightText(detail.weight),
    abilityText: abilityNames.join(' / ') || '-',
    expText: String(detail.base_experience ?? '-'),
    baseStats,
    moveList,
    moveTotalCount: detail.moves.length,
    evolutionNames,
  };
};
