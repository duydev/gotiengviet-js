# Linter (ESLint)

Dự án dùng **ESLint 8** kết hợp **@typescript-eslint** và **eslint-plugin-prettier** để kiểm tra chất lượng mã TypeScript.

## Cấu hình

| File | Vai trò |
|------|---------|
| `.eslintrc.json` | Rules chính |
| `.eslintignore` | File/thư mục bỏ qua |
| `.prettierrc` | Prettier (ESLint enforce qua plugin) |

### Rules hiện tại

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "no-console": "warn"
  }
}
```

| Rule | Mức | Ý nghĩa |
|------|-----|---------|
| `eslint:recommended` | error | Lỗi JavaScript cơ bản |
| `@typescript-eslint/recommended` | error | Lỗi TypeScript (unused vars, any, ...) |
| `prettier/prettier` | error | Vi phạm format Prettier = lỗi lint |
| `no-console` | warn | Cảnh báo khi dùng `console.log` |

### Môi trường

```json
"env": { "node": true, "jest": true }
```

Cho phép biến global của Node.js và Jest trong test.

## Lệnh

```bash
# Lint toàn bộ file .ts
npm run lint

# Tương đương
npx eslint . --ext .ts
```

Lint chạy trong:

- CI (`.github/workflows/ci.yml`)
- `prepublishOnly` (trước publish npm)
- Husky pre-commit (qua lint-staged)

## Phạm vi kiểm tra

- Tất cả file `*.ts` trong project
- Bao gồm `src/` và `src/__tests__/`
- Loại trừ theo `.eslintignore` (thường là `dist/`, `node_modules/`)

## Sửa lỗi lint

### Tự động (format)

Nhiều lỗi `prettier/prettier` sửa được bằng format:

```bash
npm run format
```

### Thủ công

1. Đọc output ESLint — mỗi dòng ghi file, dòng, rule
2. Sửa theo gợi ý hoặc [TypeScript ESLint rules](https://typescript-eslint.io/rules/)
3. Chạy lại `npm run lint`

### Ví dụ lỗi thường gặp

```typescript
// ❌ @typescript-eslint/no-unused-vars
const unused = 'x';

// ✅ Xóa hoặc dùng biến
const used = getValue();

// ❌ no-console
console.log('debug');

// ✅ Dùng trong test hoặc xóa; tránh trong production code
```

## Lint-staged (pre-commit)

Hook `.husky/pre-commit` chạy `npx lint-staged` trước mỗi commit.

**Khuyến nghị** thêm cấu hình vào `package.json`:

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

Hiện tại `lint-staged` đã cài nhưng chưa có block config — pre-commit có thể không lint file staged. Thêm config trên để kích hoạt đầy đủ.

## Tích hợp IDE

### VS Code / Cursor

Cài extension **ESLint**. Thêm vào `.vscode/settings.json` (tùy chọn):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript"]
}
```

## Khi thêm rule mới

1. Sửa `.eslintrc.json`
2. Chạy `npm run lint` trên toàn project
3. Sửa vi phạm hoặc `npm run format` nếu là lỗi Prettier
4. Commit: `chore: them eslint rule ...`

## Quality gate

Linter là bước bắt buộc trước merge vào `develop`:

```bash
npm run lint && npm test && npm run build
```

## Tài liệu liên quan

- [Formatter (Prettier)](./formatter.md)
- [Workflow feature](./feature-workflow.md)
- [Phát triển](./development.md)
