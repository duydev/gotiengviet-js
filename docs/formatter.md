# Formatter (Prettier)

Dự án dùng **Prettier 3** làm formatter chuẩn. ESLint enforce format qua `eslint-plugin-prettier`.

## Cấu hình

### `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

| Option | Giá trị | Ý nghĩa |
|--------|---------|---------|
| `semi` | `true` | Dấu chấm phẩy cuối câu lệnh |
| `trailingComma` | `all` | Trailing comma multiline |
| `singleQuote` | `true` | Nháy đơn `'` |
| `printWidth` | `80` | Xuống dòng tại 80 ký tự |
| `tabWidth` | `2` | Indent 2 spaces |
| `endOfLine` | `lf` | Unix line ending (tránh CRLF trên Windows) |

### File hỗ trợ

| File | Vai trò |
|------|---------|
| `.prettierignore` | Bỏ qua `dist/`, `node_modules/`, `coverage/` |
| `.editorconfig` | Editor dùng LF + indent 2 |
| `.gitattributes` | Git normalize `eol=lf` |

## Lệnh

```bash
# Format và ghi file
npm run format

# Chỉ kiểm tra (không ghi) — dùng CI hoặc verify
npm run format:check
```

## Phạm vi format

| Script | Phạm vi |
|--------|---------|
| `npm run format` | `src/**/*.ts` |
| lint-staged (pre-commit) | `*.ts` staged |

Format thủ công file khác:

```bash
npx prettier --write "rollup.config.js"
```

## Tích hợp ESLint

```
eslint:recommended → @typescript-eslint/recommended → prettier
```

`prettier/prettier: error` — format sai = lint fail.

Sửa nhanh:

```bash
npm run format && npm run lint
```

## Pre-commit

```json
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

Thứ tự: ESLint fix → Prettier write.

## IDE (VS Code / Cursor)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Khuyến nghị dùng ESLint fix on save thay vì format on save riêng — tránh double-format.

## Quy trình hàng ngày

```bash
npm run format
npm run lint
# hoặc để Husky lint-staged tự chạy khi commit
```

## Tài liệu liên quan

- [Linter (ESLint)](./linter.md)
- [Workflow feature](./feature-workflow.md)
- [Phát triển](./development.md)
