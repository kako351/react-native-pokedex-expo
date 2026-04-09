---
description: API通信・データフェッチングのパターン（React Query + Zod + Axios）
globs: ["src/api/**/*.ts", "src/features/**/hooks/*.ts", "src/features/**/queries.ts"]
alwaysApply: false
---

# API パターンのルール

## HTTP クライアント

`axios` を直接 import せず、必ず `src/lib/axios.ts` のインスタンスを使用する。

```typescript
// 正しい
import { http } from '@/src/lib/axios';

// 禁止
import axios from 'axios';
```

## API 関数での Zod バリデーション

API レスポンスは必ず Zod スキーマで `parse()` してバリデーションする。

```typescript
export async function fetchPokemonDetail(name: string): Promise<PokemonDetail> {
  const res = await http.get(`${pokeApiEndpoints.pokemon}/${encodeURIComponent(name)}`);
  return toPokemonDetail(PokemonDetailSchema.parse(res.data));
}
```

## React Query

- クエリ定義は `src/api/pokeapi/queries.ts` にまとめる
- 複数 API の並行取得には `useQueries` を使う

```typescript
// 複数 API 並行取得
const results = useQueries({
  queries: [
    { queryKey: ['pokemon', name], queryFn: () => fetchPokemonDetail(name) },
    { queryKey: ['species', name], queryFn: () => fetchPokemonSpecies(name) },
  ],
});
```

## エラーハンドリング

API エラーは `ApiError.fromStatus()` で統一して処理する。

```typescript
try {
  const data = await fetchPokemonDetail(name);
} catch (error) {
  const apiError = ApiError.fromStatus(axios.isAxiosError(error) ? error.response?.status : undefined);
  // apiError.code で分岐 ('NOT_FOUND' | 'NETWORK_ERROR' | 'SERVER_ERROR')
}
```

## 型推論

Zod スキーマからは `z.infer` または `zod.input` / `zod.output` で型を推論する。

```typescript
export type PokemonSummary = zod.input<typeof PokemonSummary>;
export type PokemonSummaryOutput = zod.output<typeof PokemonSummary>;
```
