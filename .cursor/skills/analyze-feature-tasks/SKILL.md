---
name: analyze-feature-tasks
description: >-
  Surveys gotiengviet-js codebase and breaks a feature requirement into
  sequential tasks with done criteria. Use after receiving a requirement, before
  implementation, or when planning feature work.
---

# Analyze Feature Tasks

Phase 2 of `docs/feature-workflow.md`.

## Steps

1. Survey `src/`, `src/__tests__/`, relevant `docs/`
2. Identify files to change (use architecture map below)
3. Break into **small sequential tasks** — each independently verifiable
4. Assign: description, target files, done criteria
5. Set all tasks to `pending`

## Required tasks (always include)

| Task | Done when |
|------|-----------|
| Git setup | `feature/<name>` created from `develop` |
| Implement | Code changes complete |
| Test | New/updated tests pass |
| Docs | `docs/` synced + changelog `[Unreleased]` |
| Quality gate | format + lint + test + build pass |
| Git merge | Merged to `develop`, branch deleted |

## File map

| Change | File |
|--------|------|
| Transform logic | `src/core/transform.ts` |
| DOM / API | `src/core/VietnameseInput.ts` |
| Input rules | `src/constants.ts` |
| Types | `src/types.ts` |
| Helpers | `src/utils/helpers.ts` |
| Public export | `src/index.ts` |
| Tests | `src/__tests__/*.test.ts` |

## Task rules

- Logic change → paired test task
- Public API change → paired docs task (`docs/api-reference.md`)
- Input rules → `docs/input-methods.md` + use skill `add-input-method`
- Transform logic → use skill `vietnamese-transform`

## Output format

```markdown
| # | Task | File | Done criteria |
|---|------|------|---------------|
| 1 | ... | ... | ... |
```

## Next phase

Invoke `track-feature-tasks` to manage execution, or `implement-feature-task` for full flow.
