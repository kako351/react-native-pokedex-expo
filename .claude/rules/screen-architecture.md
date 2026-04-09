---
description: スクリーンのアーキテクチャパターン（ルート/コンテナ/ビューの分離）
globs: ["app/**/*.tsx", "src/features/**/*.tsx", "src/features/**/*.ts"]
alwaysApply: false
---

# スクリーンアーキテクチャのルール

## 3層分離パターン

スクリーンは以下の3層に分離する。

### 1. ルートファイル (`app/(tabs)/*.tsx`)

薄いルート定義のみ。コンテナをreturnするだけ。

```typescript
// app/(tabs)/index.tsx
export default function PokedexScreenRoute() {
  return <PokedexListScreenContainer />;
}
```

### 2. コンテナ (`src/features/{feature}/screens/{Feature}Container.tsx`)

ビジネスロジックを担当。フックを呼び出し、ビューに props を渡す。

```typescript
export function PokedexListScreenContainer() {
  const { items, isLoading, selectedType, setSelectedType } = usePokedexListScreen();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PokedexListScreenView
      items={items}
      isLoading={isLoading}
      isDark={isDark}
      selectedType={selectedType}
      onSelectType={setSelectedType}
    />
  );
}
```

### 3. ビュー (`components/features/{feature}/{Feature}View.tsx`)

UI の描画のみ担当。ビジネスロジックを持たない。props で受け取ったデータを表示する。

## フックの配置

スクリーン固有のビジネスロジックは `src/features/{feature}/hooks/use{Feature}Screen.ts` に切り出す。

```typescript
export function usePokedexListScreen() {
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const { items, isLoading } = usePokemonList(undefined, selectedType);
  const filteredItems = useMemo(...);
  return { items: filteredItems, isLoading, selectedType, setSelectedType };
}
```
