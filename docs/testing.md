# Kiểm thử

## Tổng quan

Dự án sử dụng **Jest** với môi trường **jsdom** để mô phỏng DOM trong Node.js. Chiến lược test tách biệt:

| Loại | Phạm vi | File |
|------|---------|------|
| Unit test | Pure functions (transform, helpers) | `transform.test.ts`, `utils.test.ts` |
| Integration test | VietnameseInput + DOM events | `VietnameseInput.test.ts` |
| Index test | Public exports | `utilsIndex.test.ts` |

**Catalog đầy đủ 120 kịch bản:** [test-scenarios.md](./test-scenarios.md) — bảng input/expected theo từng `describe` block.

## Chạy test

```bash
# Chạy toàn bộ
npm test

# Kèm coverage report
npm run test:coverage
```

## Cấu hình Jest

Định nghĩa trong `package.json`:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "testMatch": ["**/__tests__/**/*.test.ts"],
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/index.ts",
      "!src/types.ts",
      "!src/constants.ts"
    ]
  }
}
```

### Coverage exclusions

Các file sau **không** tính coverage (dữ liệu tĩnh / re-export):

- `src/index.ts`
- `src/types.ts`
- `src/constants.ts`

## Cấu trúc test

```
src/__tests__/
├── VietnameseInput.test.ts   # Singleton, config, event handling
├── transform.test.ts         # processInputByMethod, applyToneToText
├── utils.test.ts             # getLastWord, findVowelPosition, replaceText
└── utilsIndex.test.ts        # Re-export integrity
```

## Quy ước viết test

### 1. Pure function tests (`transform.test.ts`)

Test edge cases cho logic chuyển đổi:

```typescript
describe('processInputByMethod', () => {
  it('converts telex tone s to acute', () => {
    const result = processInputByMethod('bas', INPUT_METHODS.telex);
    expect(result).toBe('bá');
  });

  it('handles multi-vowel tone priority', () => {
    const result = processInputByMethod('hoas', INPUT_METHODS.telex);
    expect(result).toBe('hoá');
  });
});
```

**Nên cover:**

- Cả 3 bộ gõ (Telex, VNI, VIQR)
- Chữ hoa / chữ thường
- Từ nhiều nguyên âm
- Trường hợp không đổi (no-op)
- Hành vi thực tế vs kỳ vọng lý tưởng (document known limitations)

### Bảng test hiện tại (125 cases)

| File | Số test | Phạm vi chính |
|------|---------|---------------|
| `transform.test.ts` | 83 | `applyToneToText`, Telex/VNI/VIQR marks & tones, edge cases |
| `utils.test.ts` | 16 | `getLastWord`, `findVowelPosition`, `shouldRestoreNonViet`, `replaceText` |
| `VietnameseInput.test.ts` | 25 | Singleton, config, DOM `handleInput`, skip email/URL/code |
| `utilsIndex.test.ts` | 1 | Re-export smoke |

Chi tiết từng kịch bản (input, expected, mục đích): **[test-scenarios.md](./test-scenarios.md)**.

### Coverage hiện tại

| Metric | Giá trị |
|--------|---------|
| Statements | ~96% |
| Branches | ~82% |
| Lines | ~97% |

Các nhánh chưa cover và known limitations: xem [mục 5–6 trong test-scenarios.md](./test-scenarios.md#5-known-limitations-tổng-hợp).

### 2. Integration tests (`VietnameseInput.test.ts`)

Test singleton lifecycle và DOM interaction:

```typescript
describe('VietnameseInput singleton', () => {
  afterEach(() => {
    VietnameseInput.destroyInstance();
  });

  it('returns the same instance', () => {
    const vi1 = VietnameseInput.getInstance();
    const vi2 = VietnameseInput.getInstance();
    expect(vi1).toBe(vi2);
  });
});
```

**Cleanup bắt buộc:** Luôn gọi `destroyInstance()` trong `afterEach` để tránh leak giữa các test.

### 3. Helper tests (`utils.test.ts`)

Test từng utility function độc lập:

- `getLastWord` — vị trí con trỏ, khoảng trắng, dấu câu
- `findVowelPosition` — nguyên âm có dấu mũ
- `replaceText` — giữ caret position, scroll state

## Môi trường jsdom

Integration test tạo DOM element thật:

```typescript
beforeEach(() => {
  input = document.createElement('input');
  document.body.appendChild(input);
});

afterEach(() => {
  document.body.removeChild(input);
});
```

Dispatch event để mô phỏng gõ:

```typescript
input.value = 'bas';
input.selectionStart = input.selectionEnd = 3;
input.dispatchEvent(new Event('input', { bubbles: true }));
```

## Quality gate

Trước khi merge, CI chạy (trên `main`, `develop`, `release/**`):

```
npm ci → format:check → lint → build → test
```

Local quality gate:

```bash
npm run quality-gate
```

PR cần:

1. Test pass trên Node 16.x, 18.x, 20.x
2. Test mới cho feature mới
3. Không giảm coverage đáng kể

## Thêm test cho feature mới

| Feature | File test | Loại |
|---------|-----------|------|
| Quy tắc bộ gõ mới | `transform.test.ts` | Unit |
| Helper mới | `utils.test.ts` | Unit |
| API method mới | `VietnameseInput.test.ts` | Integration |
| Export mới | `utilsIndex.test.ts` | Smoke |

## Debug test

```bash
# Chạy một file
npx jest src/__tests__/transform.test.ts

# Watch mode
npx jest --watch

# Verbose
npx jest --verbose
```
