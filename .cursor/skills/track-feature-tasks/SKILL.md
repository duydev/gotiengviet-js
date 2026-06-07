---
name: track-feature-tasks
description: >-
  Tracks and updates feature task status during gotiengviet-js implementation.
  Use when executing a feature workflow, updating todo progress, or ensuring
  only one task is in progress at a time.
---

# Track Feature Tasks

Phase 3 of `docs/feature-workflow.md`.

## Status model

| Status | When |
|--------|------|
| `pending` | Not started |
| `in_progress` | Actively working — **max 1** |
| `completed` | Done and verified (test/lint) |
| `cancelled` | Skipped — document reason |

## Rules

1. **Before** starting a task → set `in_progress`
2. **After** verify passes → set `completed` immediately
3. Never batch status updates at the end
4. Never mark `completed` without verification
5. Never leave multiple `in_progress`

## Tool

Use TodoWrite with `merge: true` to update task list.

```typescript
// Example flow
// pending → in_progress (start task 2)
// in_progress → completed (after test pass)
// start task 3 → in_progress
```

## Progress report

After each completed task, brief summary:

```
✓ Task N: [name] — [what was done]
→ Next: Task N+1 — [name]
```

## On failure

- Keep task `in_progress`
- Fix issue, re-verify
- Only then mark `completed`

## Phase skills per task type

| Task type | Skill |
|-----------|-------|
| Implement code | `implement-feature-code` |
| Format/lint/test | `run-quality-gate` |
| Update docs | `sync-feature-docs` |
| Git commit/merge | `gitflow-feature-merge` |

## Next

Loop: track → execute phase skill → track until all `completed`.
