# Maestro E2E

このディレクトリには Maestro 用の E2E フローを配置します。

## フロー

- `flows/pokedex-search-and-detail.yaml`:
  一覧画面で検索し、対象ポケモンの詳細表示までを確認するスモークテストです。

## 実行例

```bash
maestro test .maestro/flows/pokedex-search-and-detail.yaml --env APP_ID=com.kako351.pokedex.android
```
