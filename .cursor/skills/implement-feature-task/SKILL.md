---
name: implement-feature-task
description: >-
  Orchestrates the full 7-phase autonomous feature workflow for gotiengviet-js.
  Use when the user assigns a feature task, asks to implement a feature end-to-end,
  or wants the complete delivery from requirement to develop merge without PR.
---

# Implement Feature Task (Orchestrator)

Runs all 7 phases from `docs/feature-workflow.md`. Merge to `develop` directly — **no PR**.

## Phase → Skill map

| Phase | Skill | Action |
|-------|-------|--------|
| 1. Nhận yêu cầu | `receive-feature-requirement` | Capture goal, scope, branch name |
| 2. Phân tích tasks | `analyze-feature-tasks` | Survey code, create task list |
| 3. Theo dõi tasks | `track-feature-tasks` | Todo list, one `in_progress` |
| 4. Implement | `implement-feature-code` | Branch, code, tests |
| 5. Format & lint | `run-quality-gate` | format → lint → test → build |
| 6. Cập nhật docs | `sync-feature-docs` | docs/ + changelog |
| 7. Git merge | `gitflow-feature-merge` | commit → merge develop → push |

## Execution loop

```
receive-feature-requirement
  → analyze-feature-tasks
  → track-feature-tasks (create todos)
  → loop:
      track (in_progress)
      → implement-feature-code
      → run-quality-gate
      → sync-feature-docs
      → track (completed)
  → gitflow-feature-merge
  → all tasks completed
```

## Domain skills (during phase 4)

| Need | Skill |
|------|-------|
| Transform logic | `vietnamese-transform` |
| Input method rules | `add-input-method` |

## Principles

- Autonomous — do not stop for PR review
- Quality gate must pass before commit/merge
- Update task status after each task, not at end
- User git rules: only commit when user requests

## Done criteria

- [ ] All tasks `completed`
- [ ] Quality gate pass on `develop`
- [ ] Docs synced
- [ ] Feature branch deleted
- [ ] Code on `develop`

## Reference

`docs/feature-workflow.md`
