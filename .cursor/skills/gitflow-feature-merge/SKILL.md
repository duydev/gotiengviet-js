---
name: gitflow-feature-merge
description: >-
  Stages, commits, pushes, and merges a gotiengviet-js feature branch into
  develop via GitFlow without PR review. Use when finishing a feature task, after
  quality gate passes, or for git commit and merge operations.
---

# GitFlow Feature Merge

Phase 7 of `docs/feature-workflow.md`. **No PR required** — merge directly to `develop`.

## Prerequisites

- Skill `run-quality-gate` passed
- Skill `sync-feature-docs` completed
- On branch `feature/<short-name>`

## 1. Stage (selective)

```bash
git add src/... docs/...
```

Stage only files related to the feature. Avoid `git add .` if unrelated changes exist.

## 2. Commit

[Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: short description"
```

| Prefix | Use |
|--------|-----|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Docs only |
| `test:` | Tests only |
| `refactor:` | No behavior change |
| `chore:` | Build, CI, deps |

One commit per logical unit. User must explicitly request commits — follow user git rules.

## 3. Merge to develop (no PR)

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/<short-name>
```

## 4. Re-run quality gate on develop

```bash
npm run lint && npm test && npm run build
```

## 5. Push develop

```bash
git push origin develop
```

## 6. Cleanup

```bash
git branch -d feature/<short-name>
git push origin --delete feature/<short-name>   # if pushed to remote
```

## Allowed / forbidden

| Action | Allowed |
|--------|---------|
| feature → develop (`--no-ff`) | ✓ |
| Push develop after gate pass | ✓ |
| PR for feature review | ✗ not required |
| feature → main direct | ✗ use `release/*` only |

## Merge conflict

1. Resolve conflicts
2. `npm run lint && npm test && npm run build`
3. Complete merge commit
4. Push develop

## Reference

`docs/gitflow.md`, `docs/feature-workflow.md`
