---
name: run-quality-gate
description: >-
  Runs formatter, linter, tests, and build for gotiengviet-js before commit or
  merge. Use after code changes, before git commit, before merge to develop, or
  when verifying feature task completion.
---

# Run Quality Gate

Phase 5 of `docs/feature-workflow.md`. **All four must pass** before commit/merge.

## Commands (in order)

```bash
npm run format        # hoặc format:check để verify only
npm run lint          # hoặc lint:fix để auto-fix
npm test
npm run build
```

One-liner:

```bash
npm run format && npm run lint && npm test && npm run build
```

Pre-commit: Husky → lint-staged (`eslint --fix` + `prettier --write` trên `*.ts` staged).

## On failure

| Failure | Fix |
|---------|-----|
| Prettier/ESLint | `npm run format`, then fix remaining lint manually |
| Test | Fix code or test — re-run full gate |
| Build | Fix TypeScript/Rollup errors — re-run full gate |

Do not commit or merge until all pass.

## When to run

- After every significant code change (at least lint)
- **Mandatory** before `git commit`
- **Mandatory** after `git merge` into `develop`

## Optional

```bash
npm run test:coverage
```

## References

- `docs/formatter.md` — Prettier config
- `docs/linter.md` — ESLint rules
- `docs/testing.md` — Jest conventions

## Next

Pass → `sync-feature-docs` (if not done) → `gitflow-feature-merge`
