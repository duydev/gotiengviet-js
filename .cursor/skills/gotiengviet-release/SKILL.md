---
name: gotiengviet-release
description: >-
  Runs version bump and npm publish workflow for gotiengviet-js. Use when
  releasing a new version, updating changelog, creating git tags, or publishing
  to npm registry.
---

# Release gotiengviet-js

## Pre-release checks

```bash
npm run lint
npm test
npm run build
```

CI matrix: Node 16.x, 18.x, 20.x (`.github/workflows/ci.yml`).

## Changelog

Update `docs/changelog.md` before tagging:

```markdown
## [Unreleased]

## [1.0.1] - YYYY-MM-DD

### Fixed
- Description

### Added
- Description
```

Follow [Keep a Changelog](https://keepachangelog.com/) and [SemVer](https://semver.org/).

| Bump | When |
|------|------|
| MAJOR | Breaking API change |
| MINOR | New feature, backwards compatible |
| PATCH | Bug fix |

## Version bump

```bash
npm version patch   # 1.0.0 → 1.0.1
# or minor / major
```

## Publish

Push tag triggers `.github/workflows/publish.yml`:

```bash
git push origin main
git push origin v1.0.1
```

Requires `NPM_TOKEN` secret in GitHub.

## npm package contents

Only published: `dist/`, `LICENSE`, `README.md` (per `package.json` `files`).

## Verify

```bash
npm view gotiengviet version
```

## Local pack test

```bash
npm run build
npm pack
# Install .tgz in a test project
```

## References

- `docs/build-and-release.md`
- `docs/changelog.md`
