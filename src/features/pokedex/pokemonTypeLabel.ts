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

export const toJapaneseTypeLabel = (typeName: string) =>
  TYPE_JA[typeName] ?? typeName;
