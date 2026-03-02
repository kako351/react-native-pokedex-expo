/**
 * PokeAPI のエンドポイントパス定義。
 *
 * `API_BASE_URL` と結合して利用する前提の相対パスです。
 * 例: `${API_BASE_URL}${pokeApiEndpoints.pokemon}/25`
 *
 * - 文字列リテラルの重複を防ぎ、タイポによる不具合を減らすため。
 * - API のパス変更時に修正箇所を 1 か所に限定するため。
 * - 呼び出し側で「どのエンドポイントを使うか」を明示しやすくするため。
 */
export const pokeApiEndpoints = {
  /** ポケモン本体データ取得用エンドポイント。 */
  pokemon: '/pokemon',

  /** ポケモン種族データ取得用エンドポイント。 */
  pokemonSpecies: '/pokemon-species',
} as const;
