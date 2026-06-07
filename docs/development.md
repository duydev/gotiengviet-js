# Hướng dẫn phát triển

## Thiết lập môi trường

### Yêu cầu

- Node.js >= 14.0.0 (khuyến nghị 18.x hoặc 20.x)
- npm (đi kèm Node.js)
- Git

### Clone và cài đặt

```bash
git clone https://github.com/duydev/gotiengviet-js.git
cd gotiengviet-js
npm install
```

Hook `prepare` sẽ tự chạy `npm run build` sau `npm install`.

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run build` | Xóa `dist/`, build UMD + ESM qua Rollup |
| `npm test` | Chạy Jest (jsdom) |
| `npm run test:coverage` | Test kèm báo cáo coverage |
| `npm run lint` | ESLint trên `src/**/*.ts` |
| `npm run lint:fix` | ESLint `--fix` trên `src/**/*.ts` |
| `npm run format` | Prettier write `src/**/*.ts` |
| `npm run format:check` | Prettier check (không ghi file) |
| `npm run clean` | Xóa thư mục `dist/` |
| `npm run serve` | Static server cho demo (`example/`) |

## Cấu trúc mã nguồn

```
src/
├── index.ts                 # Public exports
├── types.ts                 # InputMethod, InputConfig, InputMethodRule
├── constants.ts             # VIETNAMESE_CHARS, INPUT_METHODS
├── core/
│   ├── VietnameseInput.ts   # DOM events, singleton, public API
│   └── transform.ts         # Pure string transformation
├── utils/
│   ├── helpers.ts           # String/DOM utilities
│   └── index.ts             # Re-exports
└── __tests__/               # Jest test files
```

## Quy ước mã nguồn

### Nguyên tắc kiến trúc

1. **Logic transform thuần** — đặt trong `src/core/transform.ts`, không truy cập DOM
2. **DOM interaction** — chỉ trong `VietnameseInput.ts` và `utils/helpers.ts`
3. **Public exports** — tập trung tại `src/index.ts`
4. **Re-export helpers** — qua `src/utils/index.ts` để import ổn định

### TypeScript

- `strict: true` trong `tsconfig.json`
- Target ES2018, lib `dom` + `es2018`
- Không thêm runtime dependency

### Lint & Format

- **ESLint** — chi tiết [linter.md](./linter.md)
- **Prettier** — chi tiết [formatter.md](./formatter.md)
- Chạy `npm run format` trước khi commit

### Git Hooks

- **Husky** `pre-commit` — chạy lint-staged
- Format tự động trên file staged (cần cấu hình `lint-staged` trong `package.json`)

## Quy trình phát triển

| Tài liệu | Nội dung |
|----------|----------|
| [GitFlow](./gitflow.md) | Nhánh `main`, `develop`, `feature/*` |
| [Workflow feature](./feature-workflow.md) | Implement feature → merge `develop` (không cần PR) |
| [Đóng góp](./contributing.md) | Quy tắc chung |

## Hướng dẫn thay đổi phổ biến

### Thêm/sửa quy tắc bộ gõ

Chỉnh `INPUT_METHODS` trong `src/constants.ts`:

```typescript
telex: {
  toneRules: { s: 1, f: 2, /* ... */ },
  markRules: { aa: 'â', /* ... */ },
}
```

Thêm test case trong `src/__tests__/transform.test.ts`.

### Sửa logic chuyển đổi

1. Sửa hàm trong `src/core/transform.ts`
2. Thêm unit test cho edge case (multi-vowel, uppercase, tone priority)
3. Không đưa DOM logic vào transform

### Thêm helper mới

1. Thêm vào `src/utils/helpers.ts` (hoặc file mới nếu module lớn)
2. Re-export qua `src/utils/index.ts`
3. Test trong `src/__tests__/utils.test.ts`

### Thay đổi public API

1. Cập nhật `src/index.ts` exports
2. Cập nhật `docs/api-reference.md` và tài liệu liên quan trong `docs/`
3. Ghi vào `docs/changelog.md` (mục `[Unreleased]`)

## Công cụ phát triển

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| TypeScript | 5.4.x | Ngôn ngữ chính |
| Rollup | 4.x | Bundler |
| Jest | 29.x | Test runner |
| ESLint | 8.x | Lint |
| Prettier | 3.x | Format |
| Husky | 8.x | Git hooks |

> **Lưu ý:** Giữ TypeScript ở phiên bản repo (5.4.x). ESLint parser có thể cảnh báo với TS version mới hơn.

## Demo local

```bash
npm run build
npm run serve
# Truy cập http://localhost:3000/example/
```

File `example/index.html` import `dist/index.esm.js` và demo toggle/đổi bộ gõ.

## Tài liệu liên quan

- [Đóng góp](./contributing.md)
- [Kiểm thử](./testing.md)
- [Build & Phát hành](./build-and-release.md)
- [Kiến trúc](./architecture.md)
