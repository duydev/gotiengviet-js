---
name: maintain-docs
description: >-
  Audits and maintains gotiengviet-js docs/ folder to stay accurate with source
  code, package config, CI, cursor skills, and project structure. Use when
  maintaining documentation, fixing doc drift, auditing docs after code changes,
  or when the user asks to sync or update project documentation.
---

# Maintain Docs

Keeps `docs/` accurate with the codebase. For incremental updates during a feature, use `sync-feature-docs`. Use this skill for **full audit** or **periodic maintenance**.

Full audit checklist: [audit-checklist.md](audit-checklist.md)

## When to run

- After merging features to `develop`
- Before release (`release/*` branch)
- User asks to "cập nhật tài liệu", "maintain docs", "kiểm tra docs"
- Suspected doc drift (API changed but docs stale)

## Workflow

```
1. Survey     — list docs/ + read source of truth
2. Audit      — compare docs vs code (checklist)
3. Fix        — update outdated files only
4. Index      — sync docs/README.md navigation
5. Cross-ref  — AGENTS.md, .cursor/skills/README.md, copilot-instructions.md
6. Verify     — no orphan docs, no stale examples
```

## Source of truth (read first)

| Topic | Source file |
|-------|-------------|
| Public API | `src/index.ts`, `src/core/VietnameseInput.ts`, `src/types.ts` |
| Input rules | `src/constants.ts` → `INPUT_METHODS` |
| Architecture | `src/core/`, `src/utils/` |
| Scripts | `package.json` → `scripts` |
| CI/CD | `.github/workflows/*.yml` |
| Lint/format | `.eslintrc.json`, `.prettierrc` |
| Version | `package.json` → `version` |
| Cursor setup | `.cursor/rules/`, `.cursor/skills/` |

## Doc inventory

| File | Must reflect |
|------|--------------|
| `docs/README.md` | Full index, badges, links |
| `docs/overview.md` | Features, scope, version, structure |
| `docs/getting-started.md` | Install, usage, framework examples |
| `docs/api-reference.md` | All public methods + types |
| `docs/input-methods.md` | `INPUT_METHODS` rules exactly |
| `docs/architecture.md` | File layout, data flow |
| `docs/development.md` | Scripts, conventions |
| `docs/testing.md` | Jest config from `package.json` |
| `docs/linter.md` | `.eslintrc.json` |
| `docs/formatter.md` | `.prettierrc` |
| `docs/gitflow.md` | Branch policy (no PR to develop) |
| `docs/feature-workflow.md` | 7 phases + skills map |
| `docs/contributing.md` | GitFlow, quality gate |
| `docs/build-and-release.md` | Rollup, CI, publish |
| `docs/changelog.md` | Keep a Changelog format |
| `docs/copilot-instructions.md` | Architecture + cursor paths |
| `docs/github/*.md` | Issue/PR templates |

## Fix rules

- Language: **Vietnamese** in `docs/`, English in source comments
- All docs live in `docs/` — root `README.md` stays minimal pointer only
- Do **not** recreate `CONTRIBUTING.md`, `CHANGELOG.md` at root
- Minimize scope — only edit docs that are actually outdated
- Add `docs/changelog.md` `[Unreleased]` entry if user-facing docs changed

## API sync (critical)

Verify `docs/api-reference.md` documents every public symbol from `src/index.ts`:

- `VietnameseInput` — `getInstance`, `destroyInstance`, `enable`, `disable`, `toggle`, `isEnabled`, `destroy`, `getInputMethod`, `setInputMethod`
- Types — `InputConfig`, `InputMethod`
- Note legacy: `processInput`, `applyTone` if still public

## Input methods sync (critical)

Compare `docs/input-methods.md` tables with `src/constants.ts` → `INPUT_METHODS` for telex, vni, viqr — every `toneRules` and `markRules` key.

## Index sync

After any add/remove/rename in `docs/`, update tables in:

- `docs/README.md`
- `AGENTS.md` (if skills/rules changed)
- `.cursor/skills/README.md`

## Output report

After maintenance, summarize:

```markdown
## Docs maintenance report
- Audited: [date]
- Files updated: ...
- Files unchanged: ...
- Issues fixed: ...
- Remaining gaps: ... (if any)
```

## Do not

- Invent features not in code
- Delete docs without user request
- Add runtime dependency mentions that don't exist
- Mix English/Vietnamese inconsistently within same doc

## Related skills

| Skill | Scope |
|-------|-------|
| `sync-feature-docs` | Phase 6 — update docs for one feature |
| `maintain-docs` | Full audit — entire docs/ folder |
