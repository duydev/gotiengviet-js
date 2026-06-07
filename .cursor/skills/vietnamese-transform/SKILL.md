---
name: vietnamese-transform
description: >-
  Modifies Vietnamese character transformation logic in gotiengviet-js transform
  engine. Use when fixing tone placement, mark replacement, vowel priority,
  uppercase handling, or edge cases in processInputByMethod or applyToneToText.
---

# Vietnamese Transform

## Scope

Only edit `src/core/transform.ts`. Keep functions pure — no DOM, no imports from `VietnameseInput`.

## Pipeline order

1. **VIQR preprocess** — reposition tone before vowel (`b'a` → `ba'`)
2. **VNI preprocess** — `dd[1-5]` → `đa[1-5]`
3. **Mark rules** — longest-key-first; skip if tone key immediately follows
4. **Normalize** — `uoiw` → `ươi`, `uơ` → `ươ`
5. **Tone rules** — scan tone keys; `0`/`z` reverts to base vowel

## Tone priority (applyToneToText)

```
a > ă > â > o > ô > ơ > e > ê > u > ư > i > y
```

## Edge cases to test

| Case | Example | Expected behavior |
|------|---------|-------------------|
| Multi-vowel tone | `hoas` (Telex) | `hóa` — tone on `o` |
| No vowel left of tone key | `xi` + `x` tone | Skip — no `xi` → `ĩ` |
| Uppercase word | `HOAS` | Correct uppercase toned vowel |
| Revert tone | `bas` + `z` (Telex) | `ba` |
| Mark already applied | double trigger | No double-replace |

## Workflow

```
- [ ] Identify which stage fails (tone / mark / normalize)
- [ ] Fix in transform.ts only
- [ ] Add regression test in transform.test.ts
- [ ] Run npm test
- [ ] Update docs/changelog.md if user-visible fix
```

## Helpers

Use `findVowelPosition` from `src/utils/helpers.ts` — do not duplicate vowel regex.

## Backwards compatibility

`VietnameseInput.processInput()` and `applyTone()` delegate here. Changing signatures requires updating shims in `VietnameseInput.ts`.
