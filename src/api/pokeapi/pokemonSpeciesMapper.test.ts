import {
  pickJapaneseFlavorText,
  pickJapaneseGenus,
  pickJapaneseName,
} from './pokemonSpeciesMapper';
import type { PokemonSpecies } from './types';

function createSpecies(
  overrides: Partial<PokemonSpecies> = {},
): PokemonSpecies {
  return {
    name: 'bulbasaur',
    evolution_chain: {
      url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
    },
    names: [],
    genera: [],
    flavor_text_entries: [],
    ...overrides,
  };
}

describe('pokemonSpeciesMapper', () => {
  describe('pickJapaneseName', () => {
    it('ja があれば日本語名を返す', () => {
      // Arrange
      const species = createSpecies({
        names: [
          { name: 'Bulbasaur', language: { name: 'en', url: 'en-url' } },
          { name: 'フシギダネ', language: { name: 'ja', url: 'ja-url' } },
        ],
      });
      // Act
      const name = pickJapaneseName(species);

      // Assert
      expect(name).toBe('フシギダネ');
    });

    it('ja がなく ja-Hrkt があればそれを返す', () => {
      // Arrange
      const species = createSpecies({
        names: [{ name: 'ふしぎだね', language: { name: 'ja-Hrkt', url: '' } }],
      });
      // Act
      const name = pickJapaneseName(species);

      // Assert
      expect(name).toBe('ふしぎだね');
    });

    it('日本語名がない場合は species.name を返す', () => {
      // Arrange
      const species = createSpecies({
        names: [{ name: 'Bulbasaur', language: { name: 'en', url: '' } }],
      });
      // Act
      const name = pickJapaneseName(species);

      // Assert
      expect(name).toBe('bulbasaur');
    });
  });

  describe('pickJapaneseGenus', () => {
    it('ja の genus を返す', () => {
      // Arrange
      const species = createSpecies({
        genera: [{ genus: 'たねポケモン', language: { name: 'ja', url: '' } }],
      });
      // Act
      const genus = pickJapaneseGenus(species);

      // Assert
      expect(genus).toBe('たねポケモン');
    });

    it('日本語 genus がない場合は null を返す', () => {
      // Arrange
      const species = createSpecies({
        genera: [{ genus: 'Seed Pokemon', language: { name: 'en', url: '' } }],
      });
      // Act
      const genus = pickJapaneseGenus(species);

      // Assert
      expect(genus).toBeNull();
    });
  });

  describe('pickJapaneseFlavorText', () => {
    it('ja の最後の要素を返し、改行や連続空白を正規化する', () => {
      // Arrange
      const species = createSpecies({
        flavor_text_entries: [
          {
            flavor_text: 'はじめの せつめい',
            language: { name: 'ja', url: '' },
            version: { name: 'red', url: '' },
          },
          {
            flavor_text: 'あたらしい\nせつめい\fです',
            language: { name: 'ja', url: '' },
            version: { name: 'blue', url: '' },
          },
        ],
      });
      // Act
      const flavorText = pickJapaneseFlavorText(species);

      // Assert
      expect(flavorText).toBe('あたらしい せつめい です');
    });

    it('ja がなく ja-Hrkt があれば最後の要素を返す', () => {
      // Arrange
      const species = createSpecies({
        flavor_text_entries: [
          {
            flavor_text: 'ふるい せつめい',
            language: { name: 'ja-Hrkt', url: '' },
          },
          {
            flavor_text: 'あたらしい せつめい',
            language: { name: 'ja-Hrkt', url: '' },
          },
        ],
      });
      // Act
      const flavorText = pickJapaneseFlavorText(species);

      // Assert
      expect(flavorText).toBe('あたらしい せつめい');
    });

    it('日本語 flavor text がない場合は null を返す', () => {
      // Arrange
      const species = createSpecies({
        flavor_text_entries: [
          {
            flavor_text: 'Seed Pokemon',
            language: { name: 'en', url: '' },
          },
        ],
      });
      // Act
      const flavorText = pickJapaneseFlavorText(species);

      // Assert
      expect(flavorText).toBeNull();
    });
  });
});
