export type FilterType = {
  label: string;
  value?: string;
};

export const FILTER_TYPES: FilterType[] = [
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

export const LIGHT_CARD_BG_COLORS = [
  '#edf1f7',
  '#ffe9de',
  '#dfecff',
  '#ddf6ea',
  '#fff4cf',
  '#f0e7ff',
  '#fde9e4',
  '#e8f0ff',
] as const;

export const DARK_CARD_BG_COLORS = [
  '#1a2a46',
  '#3d233b',
  '#153659',
  '#1b3d4a',
  '#4a3922',
  '#2f2850',
  '#4b2633',
  '#23334f',
] as const;

export const LIGHT_TYPE_BG_BY_FILTER: Record<string, string> = {
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

export const DARK_TYPE_BG_BY_FILTER: Record<string, string> = {
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
