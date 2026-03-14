import { toJapaneseTypeLabel } from './pokemonTypeLabel';

describe('toJapaneseTypeLabel', () => {
  it('既知のタイプ名を日本語に変換する', () => {
    // Arrange
    const typeName1 = 'electric';
    const typeName2 = 'ghost';

    // Act
    const label1 = toJapaneseTypeLabel(typeName1);
    const label2 = toJapaneseTypeLabel(typeName2);

    // Assert
    expect(label1).toBe('でんき');
    expect(label2).toBe('ゴースト');
  });

  it('未知のタイプ名はそのまま返す', () => {
    // Arrange
    const typeName = 'stellar';

    // Act
    const label = toJapaneseTypeLabel(typeName);

    // Assert
    expect(label).toBe('stellar');
  });
});
