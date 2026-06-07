# Docs Audit Checklist

Use with skill `maintain-docs`. Mark each item after verification.

## Public API (`docs/api-reference.md`)

```
- [ ] Exports match src/index.ts (VietnameseInput, InputConfig, InputMethod)
- [ ] All VietnameseInput public methods documented
- [ ] InputConfig fields: enabled, inputMethod
- [ ] InputMethod values: telex, vni, viqr
- [ ] Singleton pattern (getInstance / destroyInstance) described
- [ ] Event behavior (input, composition) documented
- [ ] Code examples compile logically
```

## Input methods (`docs/input-methods.md`)

```
- [ ] Telex toneRules: s, f, r, x, j, z
- [ ] Telex markRules match constants.ts
- [ ] VNI toneRules: 0-5
- [ ] VNI markRules match constants.ts
- [ ] VIQR toneRules match constants.ts
- [ ] VIQR markRules match constants.ts
- [ ] Tone priority list matches transform.ts logic
- [ ] Examples produce expected Vietnamese output
```

## Architecture (`docs/architecture.md`)

```
- [ ] File tree matches src/ layout
- [ ] VietnameseInput = DOM + singleton
- [ ] transform.ts = pure functions only
- [ ] Mermaid/flow diagrams still accurate
- [ ] Build artifacts: dist/index.js, index.esm.js, .d.ts
```

## Getting started (`docs/getting-started.md`)

```
- [ ] npm package name: gotiengviet
- [ ] Import path correct
- [ ] Framework examples (React/Vue/Angular) valid
- [ ] Config options match InputConfig type
```

## Development (`docs/development.md`)

```
- [ ] npm scripts match package.json
- [ ] Node version >= 14.0.0
- [ ] TypeScript 5.4.x mentioned if still accurate
- [ ] Links to gitflow, feature-workflow, linter, formatter
```

## Testing (`docs/testing.md`)

```
- [ ] Jest config matches package.json jest block
- [ ] Test path: src/__tests__/**/*.test.ts
- [ ] Coverage exclusions accurate
- [ ] destroyInstance cleanup pattern documented
```

## Linter (`docs/linter.md`)

```
- [ ] .eslintrc.json rules described correctly
- [ ] npm run lint command accurate
- [ ] lint-staged note reflects actual package.json config
```

## Formatter (`docs/formatter.md`)

```
- [ ] .prettierrc options match file
- [ ] npm run format scope: src/**/*.ts
```

## GitFlow (`docs/gitflow.md`)

```
- [ ] Branch types: main, develop, feature/*, release/*, hotfix/*
- [ ] Direct merge to develop (no PR) stated
- [ ] --no-ff merge documented
```

## Feature workflow (`docs/feature-workflow.md`)

```
- [ ] 7 phases complete
- [ ] Skills map matches .cursor/skills/
- [ ] Quality gate commands correct
```

## Build & release (`docs/build-and-release.md`)

```
- [ ] Rollup outputs match rollup.config.js
- [ ] CI workflow steps match .github/workflows/ci.yml
- [ ] Publish trigger: tag v*.*.*
- [ ] npm files: dist, LICENSE, README.md
```

## Changelog (`docs/changelog.md`)

```
- [ ] [Unreleased] section exists
- [ ] Latest version matches package.json
- [ ] Keep a Changelog format
```

## Meta docs

```
- [ ] docs/README.md lists all docs/
- [ ] docs/copilot-instructions.md paths current
- [ ] AGENTS.md skills/rules tables current
- [ ] .cursor/skills/README.md lists all skills
- [ ] Root README.md only points to docs/
- [ ] No orphan markdown outside docs/ (except README, LICENSE, AGENTS)
```

## Cross-links

```
- [ ] No broken relative links between docs
- [ ] No references to deleted root docs (CONTRIBUTING.md, CHANGELOG.md)
```
