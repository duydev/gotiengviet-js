# Copilot Instructions for gotiengviet-js


## Project Overview
- **Purpose:** Adds Vietnamese typing to web apps, emulating Unikey/EVKey, supporting Telex, VNI, and VIQR input methods.
- **Core:** The `VietnameseInput` class (see `src/core/VietnameseInput.ts`) attaches globally to all input events and processes text in real time (singleton pattern).
- **Input Methods:** Defined in `src/constants.ts` and `src/types.ts`. Each method has its own rules for tone and diacritic conversion.
- **Smart Detection:** Non-Vietnamese text (emails, URLs, code) is detected and preserved (see `shouldRestoreNonViet` in `src/utils/helpers.ts`).


## Architecture & Patterns
- **Entry Point:** `src/index.ts` exports the main class and types.
- **Configuration:** Only `enabled` and `inputMethod` are supported (see README for all options).
- **Singleton:** `VietnameseInput` uses a singleton pattern (`getInstance`, `destroyInstance`).
- **Event Handling:** Listens to `input`, `compositionstart`, and `compositionend` events globally (no element-level control).
- **Testing:** All helpers and core logic are covered by Jest tests in `src/__tests__/`. Only helpers that still exist in `src/utils/helpers.ts` need to be tested (e.g. `isVietnameseWord`, `getLastWord`, `findVowelPosition`, `shouldRestoreNonViet`, `replaceText`).
- **No external runtime dependencies.**

## Developer Workflows
- **Build:** `npm run build` (uses Rollup, outputs to `dist/`)
- **Test:** `npm test` (Jest, with jsdom)
- **Lint:** `npm run lint` (ESLint + Prettier)
- **Format:** `npm run format` (Prettier)
- **Pre-commit:** Lint-staged via Husky (`.husky/pre-commit`)
- **CI:** See `.github/workflows/ci.yml` for Node 16/18/20 matrix


## Project Conventions
- **TypeScript only.**
- **Tests:** Place in `src/__tests__`, name as `*.test.ts`. Only test helpers that exist in `src/utils/helpers.ts`.
- **Exports:** Only export from `src/index.ts`.
- **No dependencies in production build.**
- **Commit messages:** Use Conventional Commits (see `CONTRIBUTING.md`).


## Examples
- To add a new input method, update `INPUT_METHODS` in `src/constants.ts` and extend `InputMethodRule` in `src/types.ts`.
- To add a helper, place in `src/utils/helpers.ts` and add tests in `src/__tests__/utils.test.ts`. Only add tests for helpers that are actually exported and used.
- To support a new framework, see usage patterns in the README (React, Vue, Angular, Next.js).


## Key Files
- `src/core/VietnameseInput.ts`: Main logic (singleton, global event handling)
- `src/constants.ts`: Input method rules and config
- `src/utils/helpers.ts`: Utility functions (string/word helpers only)
- `src/__tests__/`: Test coverage for all logic and helpers in use
- `README.md`: Usage, API, and integration examples

---
For any unclear conventions or missing patterns, check `CONTRIBUTING.md` and `README.md` for the latest guidance.
