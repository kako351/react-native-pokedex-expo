import type { PokemonSpecies } from './schema/pokemonspecies';

const normalizeFlavor = (s: string) =>
  s.replace(/\n|\f/g, ' ').replace(/\s+/g, ' ').trim();

type Language = { language: { name: string } };

const pickJaEntry = <T extends Language>(entries: T[]): T | null =>
  entries.find((e) => e.language.name === 'ja') ??
  entries.find((e) => e.language.name === 'ja-Hrkt') ??
  null;

const pickJaLast = <T extends Language>(entries: T[]): T | null =>
  entries.filter((e) => e.language.name === 'ja').at(-1) ??
  entries.filter((e) => e.language.name === 'ja-Hrkt').at(-1) ??
  null;

export function pickJapaneseName(species: PokemonSpecies): string {
  return pickJaEntry(species.names)?.name ?? species.name;
}

export function pickJapaneseGenus(species: PokemonSpecies): string | null {
  return pickJaEntry(species.genera)?.genus ?? null;
}

export function pickJapaneseFlavorText(species: PokemonSpecies): string | null {
  const picked = pickJaLast(species.flavor_text_entries);
  return picked ? normalizeFlavor(picked.flavor_text) : null;
}
