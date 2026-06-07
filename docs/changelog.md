# Changelog

Tất cả thay đổi đáng chú ý của dự án được ghi tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tài liệu `docs/test-scenarios.md` — catalog đầy đủ 120 kịch bản test (input, expected, mục đích, known limitations).
- Mở rộng test suite: 34 → 120 test cases; coverage ~96% statements / ~82% branches.
- Test `transform.test.ts`: Telex/VNI/VIQR đầy đủ, `applyToneToText`, edge cases và known limitations.
- Test `utils.test.ts`: fallback `replaceText`, khôi phục `scrollTop`.
- Test `VietnameseInput.test.ts`: default config, VNI/VIQR integration, `selectionStart` null.
- Tài liệu `docs/business-flows.md` — 11 luồng nghiệp vụ chi tiết kèm sơ đồ Mermaid (tích hợp, gõ runtime, transform, GitFlow, CI/CD).
- `.editorconfig`, `.gitattributes`, `.prettierignore` — chuẩn hóa LF line endings.
- `lint-staged` config trong `package.json` — pre-commit tự lint + format.
- Scripts `lint:fix`, `format:check`.

### Changed

- Prettier: thêm `endOfLine: "lf"` — sửa 826 lỗi CRLF trên Windows.
- ESLint: thêm `browser` env, `parserOptions`, rules `no-unused-vars` (`^_`), scope `src/**/*.ts`.
- Chuẩn hóa line endings toàn bộ `src/**/*.ts` sang LF.

## [1.0.0] - 2025-09-13

### Added

- Phát hành ổn định đầu tiên của gotiengviet-js.
- Hỗ trợ gõ tiếng Việt với Telex, VNI và VIQR.
- Phát hiện thông minh để tránh sửa email, URL và token giống mã nguồn.
- API công khai `VietnameseInput`: `getInstance`, `destroyInstance`, `enable`, `disable`, `toggle`, `setInputMethod`, `getInputMethod`.
- Định nghĩa kiểu TypeScript và artifacts build Rollup.
- Unit test (Jest) và workflow CI.
