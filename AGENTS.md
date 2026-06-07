# Agent Instructions

gotiengviet-js is a zero-dependency TypeScript library for Vietnamese typing in web apps.

## Quick reference

- **Docs:** [docs/README.md](docs/README.md)
- **Public API:** `VietnameseInput` from `src/index.ts`
- **Architecture:** DOM singleton (`VietnameseInput.ts`) + pure transforms (`transform.ts`)

## Cursor rules

| Rule | Scope |
|------|-------|
| `project-overview` | Always applies |
| `typescript-architecture` | `src/**/*.ts` |
| `testing-conventions` | `src/__tests__/**/*.ts` |
| `documentation` | `docs/**/*.md` |

## Feature task workflow (autonomous)

7 phases — no PR, merge directly to `develop`:

1. Receive requirement
2. Analyze & create tasks
3. Track & update task status (one `in_progress` at a time)
4. Implement
5. Format & lint (`npm run format && npm run lint && npm test && npm run build`)
6. Update `docs/` + changelog
7. Stage → commit → merge `--no-ff` → push `develop` → delete feature branch

Full guide: `docs/feature-workflow.md` — orchestrator: `implement-feature-task`

## Cursor skills

### Feature workflow (7 phases)

| Phase | Skill |
|-------|-------|
| Orchestrator | `implement-feature-task` |
| 1. Nhận yêu cầu | `receive-feature-requirement` |
| 2. Phân tích tasks | `analyze-feature-tasks` |
| 3. Theo dõi tasks | `track-feature-tasks` |
| 4. Implement | `implement-feature-code` |
| 5. Format & lint | `run-quality-gate` |
| 6. Cập nhật docs | `sync-feature-docs` |
| 7. Git merge | `gitflow-feature-merge` |

### Documentation

| Skill | Use when |
|-------|----------|
| `maintain-docs` | Audit and sync entire `docs/` with codebase |
| `sync-feature-docs` | Update docs during feature workflow (phase 6) |

### Domain & release

| Skill | Use when |
|-------|----------|
| `add-input-method` | Telex/VNI/VIQR rules |
| `vietnamese-transform` | Transform logic in transform.ts |
| `gotiengviet-contribute` | Contribution quick reference |
| `gotiengviet-release` | Version bump and npm publish |

Index: `.cursor/skills/README.md`

## Quality gate

```bash
npm run lint && npm test && npm run build
```
