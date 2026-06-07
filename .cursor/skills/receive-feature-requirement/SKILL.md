---
name: receive-feature-requirement
description: >-
  Captures and structures a feature requirement for gotiengviet-js workflow phase
  1. Use when receiving a new feature request, bug-to-fix task, GitHub issue, or
  before analyzing and implementing any feature task.
---

# Receive Feature Requirement

Phase 1 of `docs/feature-workflow.md`. Output a structured requirement before coding.

## Steps

1. Read the full request (issue, user message, bug report)
2. Extract **goal**, **scope**, **constraints**
3. Classify change type: `feat` | `fix` | `refactor` | `docs`
4. Check against project scope in `docs/overview.md` — flag if out of scope
5. Propose branch name: `feature/<short-kebab-case>`

## Output template

Present this to user (or keep internally) before phase 2:

```markdown
## Yêu cầu
- Mục tiêu: [what to achieve]
- Phạm vi: trong dự án | ngoài dự án (ghi lý do)
- Ràng buộc: [no new deps, API compat, etc.]
- Loại: feat | fix | refactor | docs
- Nhánh dự kiến: feature/<ten-ngan>
- Commit prefix dự kiến: feat: | fix: | ...
```

## Rules

- Do not start implementation in this phase
- If scope is unclear, ask one focused question — then proceed
- Bug reports treated as `fix` with branch `feature/<fix-name>` or `fix/<name>`

## Next phase

Invoke skill `analyze-feature-tasks` or parent `implement-feature-task`.
