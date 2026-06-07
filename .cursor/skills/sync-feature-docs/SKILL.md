---
name: sync-feature-docs
description: >-
  Updates gotiengviet-js documentation in docs/ to match code changes during
  feature workflow. Use after implementing features, before git commit, or when
  API, input methods, or architecture changed.
---

# Sync Feature Docs

Phase 6 of `docs/feature-workflow.md`. Run **before commit**.

## Change → doc map

| Code change | Update file |
|-------------|-------------|
| Public API | `docs/api-reference.md` |
| Input method rules | `docs/input-methods.md` |
| Architecture / flow | `docs/architecture.md` |
| Business flows / diagrams | `docs/business-flows.md` |
| Usage / integration | `docs/getting-started.md` |
| Build / CI | `docs/build-and-release.md` |
| User-facing any | `docs/changelog.md` → `[Unreleased]` |
| Workflow itself | `docs/feature-workflow.md` |

## Checklist

```
- [ ] API docs match src/index.ts exports
- [ ] Code examples in docs are valid
- [ ] changelog.md has [Unreleased] entry
- [ ] No new docs outside docs/ (root README stays minimal)
- [ ] Vietnamese language for docs/ content
```

## Changelog entry example

```markdown
## [Unreleased]

### Added
- Short description of feature

### Fixed
- Short description of fix
```

## Rules

- Do not create root-level CONTRIBUTING/CHANGELOG — use `docs/`
- Source code comments stay English
- Skip doc updates only for internal refactors with zero user impact

## Verify

After editing, ensure changed docs are included in `git add` for commit.

## Full audit

For entire `docs/` folder audit (not just current feature), use skill `maintain-docs`.

## Next

`gitflow-feature-merge`
