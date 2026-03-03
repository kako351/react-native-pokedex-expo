# Repository Guidelines

## Language Requirement

- All responses and code reviews must be written in Japanese.

## Project Structure & Module Organization

- `app/`: Expo Router routes and screens (for example `app/(tabs)/index.tsx`).
- `components/`: Reusable UI components and platform-specific variants.
- `hooks/` and `constants/`: Shared hooks and theme/constants.
- `src/`: Application logic (API client, endpoint definitions, schemas, config).
- `assets/images/`: App icons and static image assets.
- `scripts/`: Utility scripts such as `reset-project.js`.

Keep feature logic close to its domain (for example, PokeAPI schemas under `src/api/pokeapi/schema/`).

## Build, Test, and Development Commands

- `npm run start`: Start Expo dev server.
- `npm run ios` / `npm run android` / `npm run web`: Launch target platform.
- `npm run lint`: Run Expo ESLint config checks.
- `npm run lint:fix`: Auto-fix lint issues where possible.
- `npm run type-check`: Run TypeScript checks without emitting output.
- `npm run format:check`: Verify Prettier formatting.
- `npm run format`: Apply Prettier formatting.

Run `npm run lint && npm run type-check && npm run format:check` before opening a PR.

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts`/`.tsx`) with React Native + Expo Router.
- Formatting: Prettier (`singleQuote: true`, `trailingComma: all`).
- Linting: `eslint-config-expo` (flat config in `eslint.config.js`).
- Naming:
  - Components: `PascalCase` file and symbol names.
  - Hooks: `useXxx` in camelCase.
  - Schemas/types/constants: descriptive `PascalCase` exports, camelCase locals.

Prefer explicit `zod` schemas and inferred types (`z.infer`) for API payloads.

## Testing Guidelines

There is currently no dedicated automated test framework configured in this repository.  
Until tests are introduced, use this minimum validation set:

- `npm run lint`
- `npm run type-check`
- manual smoke test on at least one target (`ios`, `android`, or `web`)

When adding tests in the future, colocate them near features (for example `src/**/__tests__/` or `*.test.ts`).

## Commit & Pull Request Guidelines

- Commit history favors short, imperative messages, often in Japanese (for example `detail schema追加`, `format適応`).
- Keep one logical change per commit.
- When writing PR descriptions, follow the format in `.github/pull_request_template.md`.
- PRs should include:
  - concise summary and motivation,
  - key changed paths,
  - verification steps/results,
  - screenshots or recordings for UI changes.

Link related issues and call out any environment/config changes (`app.config.ts`, `src/config/env.ts`).
