---
description: ユニットテストの記述ルール（AAAパターン）
globs:
  - '**/*.test.ts'
  - '**/*.test.tsx'
  - '**/*.spec.ts'
  - '**/*.spec.tsx'
alwaysApply: true
---

# Unit Test AAA Rule

- ユニットテストは必ず AAA パターンで記述する。
- 各テストケースは `Arrange -> Act -> Assert` の順で構成する。
- `Act` では対象の振る舞いを 1 回だけ実行する。
- `Assert` では実装詳細ではなく、外部から観測可能な振る舞いを検証する。
- テスト名は「どの条件で、何を期待するか」が分かる振る舞いベースで書く。
