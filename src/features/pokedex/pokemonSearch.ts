import type { PokemonListItem } from './model/pokemonListItem';

export const normalizePokemonSearchKeyword = (value: string) =>
  value.trim().toLocaleLowerCase().normalize('NFKC');

export const filterPokemonListByKeyword = (
  items: PokemonListItem[],
  keyword: string,
) => {
  const normalizedKeyword = normalizePokemonSearchKeyword(keyword);
  if (!normalizedKeyword) return items;

  return items.filter((item) => {
    const searchable = [
      item.name,
      item.displayName,
      item.displayNo,
      String(item.id),
    ]
      .map((value) => normalizePokemonSearchKeyword(value))
      .join(' ');

    return searchable.includes(normalizedKeyword);
  });
};
