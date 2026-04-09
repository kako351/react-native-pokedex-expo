---
description: ライト/ダークテーマのスタイリングパターン
globs: ["components/**/*.tsx", "src/features/**/components/**/*.tsx", "hooks/use-theme-color.ts"]
alwaysApply: false
---

# テーマ・スタイリングのルール

## グローバルコンポーネント

共通コンポーネントでは `ThemedText` / `ThemedView` と `useThemeColor` フックを使用する。

```typescript
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

// カスタムカラー
const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
```

## フィーチャー固有のスタイル

フィーチャー固有のスタイルは `lightStyles` / `darkStyles` を別々に `StyleSheet.create()` で定義し、`isDark` フラグで切り替える。

```typescript
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fffdf7' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#0b1020' },
});

// 使用時
const styles = isDark ? darkStyles : lightStyles;
return <View style={styles.container} />;
```

## カラー定数

アプリ共通のカラーは `constants/theme.ts` の `Colors` から参照する。

```typescript
import { Colors } from '@/constants/theme';

const color = Colors[colorScheme ?? 'light'].tint;
```

## プラットフォーム固有の実装

プラットフォーム別に実装を分ける場合はファイルサフィックスで分離する。

- `hooks/use-color-scheme.ts` — native (iOS / Android)
- `hooks/use-color-scheme.web.ts` — Web
- `components/ui/icon-symbol.ios.tsx` — iOS
- `components/ui/icon-symbol.tsx` — Android / Web fallback

Metro / Expo はサフィックスを自動で解決するため、import は拡張子なしで行う。
