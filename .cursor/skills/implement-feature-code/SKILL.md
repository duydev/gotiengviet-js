---
name: implement-feature-code
description: >-
  Implements feature code changes in gotiengviet-js following layered
  architecture. Use during feature workflow phase 4, when writing or modifying
  source code, tests, or creating a feature branch.
---

# Implement Feature Code

Phase 4 of `docs/feature-workflow.md`.

## Git setup (first)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<short-name>
```

If `develop` missing: see `docs/gitflow.md`.

## Architecture rules

- **Pure transform** in `src/core/transform.ts` — no DOM
- **DOM/events** in `src/core/VietnameseInput.ts`
- **Caret/text** helpers in `src/utils/helpers.ts`
- **Public exports** only in `src/index.ts`
- **Zero** runtime dependencies

## Implement by change type

| Change | Action |
|--------|--------|
| Transform logic | Edit `transform.ts` → skill `vietnamese-transform` |
| Input method rules | Edit `constants.ts` → skill `add-input-method` |
| Public API | `VietnameseInput.ts` + `index.ts` + types |
| Helpers | `utils/helpers.ts` + re-export `utils/index.ts` |

## Tests (same phase)

Add/update tests in `src/__tests__/`:

```typescript
afterEach(() => {
  VietnameseInput.destroyInstance();
});
```

Run after implementing:

```bash
npm test
```

## After code changes

1. Run skill `run-quality-gate`
2. Run skill `sync-feature-docs`
3. Continue tracking via `track-feature-tasks`

## Do not

- Commit in this phase (use `gitflow-feature-merge`)
- Skip tests for logic changes
- Import DOM APIs in `transform.ts`

## Reference

`docs/architecture.md`, `docs/testing.md`
