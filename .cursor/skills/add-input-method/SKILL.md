---
name: add-input-method
description: >-
  Adds or modifies Vietnamese input method rules (Telex, VNI, VIQR) in
  gotiengviet-js. Use when adding a new input method, changing tone/mark rules,
  or updating INPUT_METHODS in constants.ts.
---

# Add Input Method

## Files to touch

1. `src/types.ts` — extend `InputMethod` union if adding a new method
2. `src/constants.ts` — add/update `INPUT_METHODS` entry
3. `src/__tests__/transform.test.ts` — conversion test cases
4. `docs/input-methods.md` — rule tables
5. `docs/changelog.md` — `[Unreleased]` entry

## INPUT_METHODS shape

```typescript
telex: {
  toneRules: { s: 1, f: 2, r: 3, x: 4, j: 5, z: 0 },
  markRules: { aa: 'â', AA: 'Â', dd: 'đ', DD: 'Đ' },
}
```

- `toneRules`: key → tone index (0=none, 1=sắc, 2=huyền, 3=hỏi, 4=ngã, 5=nặng)
- `markRules`: sequence → resulting character (include uppercase pairs)

## Workflow

```
- [ ] Define toneRules and markRules in constants.ts
- [ ] Add type to InputMethod if new method
- [ ] Add unit tests for tone + mark conversions (lowercase and uppercase)
- [ ] Test full word examples (e.g. "tieengs vieetj" → "tiếng việt")
- [ ] Update docs/input-methods.md
- [ ] Run npm test && npm run lint
```

## Test examples

```typescript
it('converts telex word', () => {
  expect(processInputByMethod('tieengs', INPUT_METHODS.telex)).toBe('tiếng');
});
```

## Do not

- Put rules in `transform.ts` — engine reads from `INPUT_METHODS`
- Add runtime dependencies
- Skip uppercase variant tests when mark rules have `AA`, `DD`, etc.
