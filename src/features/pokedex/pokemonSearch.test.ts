import {
  filterPokemonListByKeyword,
  normalizePokemonSearchKeyword,
} from './pokemonSearch';
import type { PokemonListItem } from './usePokemonList';

const ITEMS: PokemonListItem[] = [
  {
    id: 25,
    name: 'pikachu',
    displayName: 'ピカチュウ',
    displayNo: '#0025',
    imageUrl: 'https://example.com/pikachu.png',
  },
  {
    id: 6,
    name: 'charizard',
    displayName: 'リザードン',
    displayNo: '#0006',
    imageUrl: 'https://example.com/charizard.png',
  },
];

describe('normalizePokemonSearchKeyword', () => {
  it('前後スペース・全角数字・大文字を正規化する', () => {
    expect(normalizePokemonSearchKeyword('  ＃００２５  ')).toBe('#0025');
    expect(normalizePokemonSearchKeyword('PIKACHU')).toBe('pikachu');
  });
});

describe('filterPokemonListByKeyword', () => {
  it('キーワード未入力時は全件を返す', () => {
    expect(filterPokemonListByKeyword(ITEMS, '   ')).toEqual(ITEMS);
  });

  it('英名・日本語名・図鑑番号で部分一致検索できる', () => {
    expect(filterPokemonListByKeyword(ITEMS, 'pika')).toEqual([ITEMS[0]]);
    expect(filterPokemonListByKeyword(ITEMS, 'リザー')).toEqual([ITEMS[1]]);
    expect(filterPokemonListByKeyword(ITEMS, '25')).toEqual([ITEMS[0]]);
  });
});
