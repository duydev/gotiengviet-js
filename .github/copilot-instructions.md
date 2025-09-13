# Copilot Instructions for gotiengviet-js


# Copilot Instructions for gotiengviet-js

This document gives concise, up-to-date guidance for contributors and for automated code assistants working on this repository.

## Project overview
- Purpose: add Vietnamese typing to web apps, emulating Unikey/EVKey; supports Telex, VNI, and VIQR input methods.
- Public API: the library exposes a single primary entry point (`VietnameseInput`) and some public types from `src/index.ts`.

## Architecture & coding patterns
- Core responsibilities are split as follows:
	- `src/core/VietnameseInput.ts`: DOM and event wiring, singleton lifecycle (getInstance/destroyInstance), public instance methods (enable/disable/toggle, setInputMethod/getInputMethod).
	- `src/core/transform.ts`: pure, side-effect-free string transformation functions (tone/diacritic logic). Prefer adding logic here so it can be unit-tested without DOM.
	- `src/utils/*`: small, focused helper modules (string/vowel detection, caret/replace helpers). Re-export public helpers from `src/utils/index.ts` to keep imports stable.
	- `src/constants.ts` and `src/types.ts`: canonical rules and types for input methods.

- Event handling: `VietnameseInput` listens to `input`, `compositionstart`, and `compositionend` globally and delegates transformation to `core/transform`.
- Keep DOM interactions out of `core/transform.ts` — functions there should accept and return strings (and optionally indices) only.

## Developer workflows (commands)
- Build: `npm run build` (Rollup -> `dist/`)
- Test: `npm test` (Jest, jsdom)
- Lint: `npm run lint` (ESLint)
- Format: `npm run format` (Prettier)

Note: development TypeScript in this repository targets TypeScript 5.4.x (see `devDependencies`). The ESLint parser has limited support for newer TS versions; prefer the repo's TS version to avoid parser warnings.

## Testing conventions
- Put tests under `src/__tests__` and name them `*.test.ts`.
- Pure functions in `src/core/transform.ts` should have focused unit tests that exercise edge cases (multi-vowel words, uppercase vs lowercase, tone priority). Tests for helpers belong alongside them or in a single `utils.test.ts`.
- Integration tests that exercise `VietnameseInput` behavior (singleton, event handling) are allowed and live in `src/__tests__`.

## Files and exports
- Keep all public exports centralized in `src/index.ts`. Consumers should import from the package root rather than internal paths.
- Use `src/utils/index.ts` to re-export helper functions; this allows moving helpers between files without changing imports elsewhere.

Key files
- `src/index.ts` — public exports (VietnameseInput, public types)
- `src/core/VietnameseInput.ts` — DOM/event wiring and public instance API
- `src/core/transform.ts` — pure text transformation utilities (unit-test here)
- `src/constants.ts` — input rules (INPUT_METHODS, VIETNAMESE_CHARS)
- `src/types.ts` — InputMethod, InputConfig, InputMethodRule
- `src/utils/helpers.ts` — small helper functions; consider splitting into `src/utils/string.ts`, `src/utils/dom.ts` if the file grows
- `src/utils/index.ts` — re-exports for helpers
- `src/__tests__/` — tests

## Contribution patterns & examples
- Add a new input method: update `INPUT_METHODS` in `src/constants.ts` and ensure `InputMethodRule` in `src/types.ts` still describes it. Add tests showing sample conversions.
- Add or change transformation logic: prefer pure helpers in `src/core/transform.ts`. Add unit tests for each pure function. Keep DOM replacement logic (caret handling) in `src/utils/helpers.ts` or `src/utils/dom.ts`.
- Adding helpers: place them under `src/utils/` and export from `src/utils/index.ts`. Add tests under `src/__tests__`.

## Backwards compatibility and deprecations
- Some internal APIs (e.g., `VietnameseInput.processInput` and `applyTone`) are currently exposed for tests/compatibility. If you change internal structure, add a lightweight shim/deprecation wrapper and document removal in a future major release.

## CI and quality gates
- CI should run: `npm ci`, `npm run build`, `npm test`, and `npm run lint` on PRs. If you maintain CI workflows, ensure they use the repository's TypeScript version (5.4.x) or the ESLint parser supports the desired version.

## Misc
- Keep code TypeScript-only and avoid adding runtime dependencies.
- Follow existing format/lint rules. Use Conventional Commits for messages.

If anything here is unclear, consult `CONTRIBUTING.md` and `README.md` for higher-level decisions.
