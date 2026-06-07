---
name: gotiengviet-contribute
description: >-
  Quick reference for gotiengviet-js contribution rules and links to feature
  workflow skills. Use when contributing code or needing an overview of
  contribution standards without running the full feature workflow.
---

# Contribute to gotiengviet-js

Lightweight index. For full delivery use **`implement-feature-task`**.

## Feature workflow skills

| Phase | Skill |
|-------|-------|
| Full flow | `implement-feature-task` |
| 1–7 individual | See `.cursor/skills/README.md` |

## Essentials

- GitFlow: `feature/*` → `develop` (no PR)
- Quality gate: `run-quality-gate`
- Docs: `sync-feature-docs`
- Merge: `gitflow-feature-merge`

## Quality gate

```bash
npm run format && npm run lint && npm test && npm run build
```

## References

- `docs/feature-workflow.md`
- `docs/contributing.md`
- `docs/gitflow.md`
