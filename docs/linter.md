# Linter (ESLint)

Dự án dùng **ESLint 8** kết hợp **@typescript-eslint** và **eslint-plugin-prettier** để kiểm tra chất lượng mã TypeScript.

## Cấu hình

| File | Vai trò |
|------|---------|
| `.eslintrc.json` | Rules chính |
| `.eslintignore` | File/thư mục bỏ qua |
| `.prettierrc` | Prettier (ESLint enforce qua plugin) |
| `.editorconfig` | Đồng bộ editor (LF, indent) |
| `.gitattributes` | Chuẩn hóa line ending trong Git |

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
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "env": { "browser": true, "node": true, "jest": true, "es2018": true }
}
```

| Rule | Mức | Ý nghĩa |
|------|-----|---------|
| `eslint:recommended` | error | Lỗi JavaScript cơ bản |
| `@typescript-eslint/recommended` | error | Lỗi TypeScript |
| `prettier/prettier` | error | Vi phạm format Prettier = lỗi lint |
| `no-console` | warn | Cảnh báo `console.log` |
| `no-unused-vars` | error | Cho phép prefix `_` cho biến cố ý không dùng |
| `no-explicit-any` | warn | Cảnh báo khi dùng `any` |

### Parser

```json
"parserOptions": { "ecmaVersion": 2018, "sourceType": "module" }
```

## Lệnh

```bash
# Lint src/
npm run lint

# Lint + tự sửa (eslint --fix + prettier qua plugin)
npm run lint:fix
```

Lint chạy trong:

- CI (`.github/workflows/ci.yml`)
- `prepublishOnly` (trước publish npm)
- Husky pre-commit (qua lint-staged)

## Phạm vi kiểm tra

- `src/**/*.ts` (source + tests)
- Loại trừ: `dist/`, `node_modules/`, `coverage/` (`.eslintignore` + `ignorePatterns`)

## Sửa lỗi lint

### Tự động

```bash
npm run format      # Sửa lỗi prettier/prettier (CRLF, spacing...)
npm run lint:fix    # ESLint --fix
```

### Lỗi CRLF (Windows)

Dự án dùng **LF** (`endOfLine: "lf"`). Nếu gặp `Delete ␍`:

```bash
npm run format
```

File `.editorconfig` và `.gitattributes` giúp editor/Git giữ LF.

## Lint-staged (pre-commit)

Hook `.husky/pre-commit` → `npx lint-staged`.

Config trong `package.json`:

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"]
  }
}
```

Chỉ lint/format file **staged** — nhanh hơn lint toàn project.

## Tích hợp IDE

### VS Code / Cursor

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript"],
  "files.eol": "\n"
}
```

## Quality gate

```bash
npm run format && npm run lint && npm test && npm run build
```

## Tài liệu liên quan

- [Formatter (Prettier)](./formatter.md)
- [Workflow feature](./feature-workflow.md)
- [Phát triển](./development.md)
