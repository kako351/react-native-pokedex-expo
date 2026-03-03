import type { PokemonSpecies } from './schema/pokemonspecies';

const normalizeFlavor = (s: string) =>
  s.replace(/\n|\f/g, ' ').replace(/\s+/g, ' ').trim();

export function pickJapaneseName(species: PokemonSpecies): string {
  return (
    species.names.find((n) => n.language.name === 'ja')?.name ??
    species.names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
    species.name
  );
}

export function pickJapaneseGenus(species: PokemonSpecies): string | null {
  return (
    species.genera.find((g) => g.language.name === 'ja')?.genus ??
    species.genera.find((g) => g.language.name === 'ja-Hrkt')?.genus ??
    null
  );
}

export function pickJapaneseFlavorText(species: PokemonSpecies): string | null {
  const ja = species.flavor_text_entries.filter(
    (e) => e.language.name === 'ja' || e.language.name === 'ja-Hrkt',
  );
  if (ja.length === 0) return null;
  return normalizeFlavor(ja[ja.length - 1].flavor_text);
}
