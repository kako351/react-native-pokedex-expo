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
