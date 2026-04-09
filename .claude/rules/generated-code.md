---
description: Orval で自動生成されたファイルの取り扱いルール
globs: ["src/api/pokeapi/generated/**"]
alwaysApply: true
---

# 自動生成コードのルール

## 禁止事項

`src/api/pokeapi/generated/` 配下のファイルは **手動で編集してはならない**。
このディレクトリは Orval によって OpenAPI スキーマから自動生成されており、手動変更は次回の生成時に上書きされる。

## スキーマのカスタマイズ方法

生成スキーマに変更を加えたい場合は `src/api/pokeapi/parsers.ts` を使用する。

```typescript
// 必要なフィールドだけ選択
const PokemonDetailSchema = GeneratedPokemonDetail.pick({
  id: true,
  name: true,
  types: true,
});

// フィールドの追加・上書き
const ExtendedSchema = GeneratedPokemonDetail.extend({
  customField: z.string(),
});
```

## 再生成

OpenAPI スキーマに変更があった場合は以下のコマンドで再生成する。

```bash
npm run generate:pokeapi-schemas
```
