# Formatter (Prettier)

Dự án dùng **Prettier 3** làm formatter chuẩn cho mã TypeScript. ESLint enforce format qua `eslint-plugin-prettier` — vi phạm format = lỗi lint.

## Cấu hình

File `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

| Option | Giá trị | Ý nghĩa |
|--------|---------|---------|
| `semi` | `true` | Luôn có dấu chấm phẩy cuối câu lệnh |
| `trailingComma` | `all` | Dấu phẩy cuối trong object/array multiline |
| `singleQuote` | `true` | Chuỗi dùng nháy đơn `'` |
| `printWidth` | `80` | Xuống dòng khi vượt 80 ký tự |
| `tabWidth` | `2` | Indent 2 spaces |

## Lệnh

```bash
# Format toàn bộ source TypeScript
npm run format

# Tương đương
npx prettier --write "src/**/*.ts"

# Kiểm tra không format (dùng trong CI tùy chọn)
npx prettier --check "src/**/*.ts"
```

**Lưu ý:** `npm run format` chỉ format `src/**/*.ts`, không format `docs/`, `rollup.config.js`, v.v.

## Phạm vi format

| Được format | Không tự động format |
|-------------|----------------------|
| `src/**/*.ts` | `docs/**/*.md` |
| (qua lint-staged khi commit) | `rollup.config.js`, `*.json` |

Format file ngoài `src/` thủ công:

```bash
npx prettier --write "rollup.config.js"
npx prettier --write "docs/**/*.md"
```

## Tích hợp ESLint

Prettier không chạy độc lập trong CI — ESLint báo lỗi format:

```
error  Delete `··`  prettier/prettier
```

Sửa bằng `npm run format` hoặc `eslint --fix`.

Thứ tự extends trong `.eslintrc.json`:

```
eslint:recommended → @typescript-eslint/recommended → prettier
```

`eslint-config-prettier` tắt ESLint rules xung đột với Prettier.

## Pre-commit (lint-staged)

Hook Husky gọi lint-staged. Khuyến nghị config:

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Thứ tự: ESLint fix trước, Prettier ghi file sau.

## Ví dụ trước/sau format

```typescript
// ❌ Trước
const x={a:1,b:2}
import {VietnameseInput} from "./core/VietnameseInput"

// ✅ Sau
const x = { a: 1, b: 2 };
import { VietnameseInput } from './core/VietnameseInput';
```

## IDE

### VS Code / Cursor

Cài extension **Prettier**. Tùy chọn format on save:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Khi bật ESLint fix on save, có thể tắt `formatOnSave` cho TypeScript để tránh xung đột — ESLint + Prettier plugin đã đủ.

## Quy trình hàng ngày

```bash
# Trước commit
npm run format
npm run lint

# Hoặc một lệnh (nếu đã có lint-staged config)
git add .
git commit -m "feat: ..."
# → Husky tự format + lint file staged
```

## Không format thủ công

Prettier ít khi cần ignore. Nếu bắt buộc:

```typescript
// prettier-ignore
const matrix = [
  1, 0,
  0, 1,
];
```

## Tài liệu liên quan

- [Linter (ESLint)](./linter.md)
- [Workflow feature](./feature-workflow.md)
- [Phát triển](./development.md)
