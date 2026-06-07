# Changelog

Tất cả thay đổi đáng chú ý của dự án được ghi tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Pipeline transform: mark → normalize → tone (sửa `tieengs`→`tiếng`, `nguoiwf`→`người`, `basz`→`ba`).
- `findVowelPosition` nhận diện nguyên âm có dấu (revert tone `z`/`0` hoạt động trên `má`→`ma`).
- VIQR: `a^`→`â`, tone trước vowel (`b'a`→`bá`), thêm mark `ee`→`ê`.
- VNI: `dd1`→`đá`, `ee`→`ê`, `ba10`→`bá0`.
- Guard mark khi tone key ngay sau (`baas`→`baá`), skip tone lặp trên vowel đã dấu (`ass`→`ás`).

### Added

- Hỗ trợ `contenteditable`: `handleInput` và `replaceText` hoạt động trên phần tử có `contenteditable="true"`.
- Helper DOM: `isEditableElement`, `isContentEditableElement`, `getEditableText`, `getCaretOffset` (dùng nội bộ; `replaceText` mở rộng cho contenteditable).
- Export công khai `processInputByMethod`, `applyToneToText` (headless transform).
- Script `npm run quality-gate` — format:check → lint → test → build.
- CI chạy trên `develop` và `release/**`; thêm bước `format:check`.
- Integration test: `shouldRestoreNonViet` (email, URL, biến) trong `handleInput`.
- Test regression mark revert loop (`âaa`).
- Tài liệu `docs/test-scenarios.md` — catalog đầy đủ kịch bản test.
- Mở rộng test suite: 34 → 124 test cases; coverage ~96% statements / ~82% branches.
- Tài liệu `docs/business-flows.md` — 11 luồng nghiệp vụ kèm Mermaid.
- `.editorconfig`, `.gitattributes`, `.prettierignore`, `lint-staged`, scripts `lint:fix`, `format:check`.

### Changed

- `handleInput` gọi `shouldRestoreNonViet` — kích hoạt phát hiện email/URL/biến.
- `transform.ts`: guard vòng lặp vô hạn mark revert; cache sorted mark keys; hoist `TONE_VOWEL_PRIORITY`.
- `prepare` chỉ chạy `husky install` (bỏ build mỗi `npm install`).
- Gỡ pin `jest-util` lệch major Jest 29.
- `.npmignore`: bỏ mục lỗi thời.
- CI: nâng `actions/checkout` và `setup-node` lên v4.
- Prettier `endOfLine: "lf"`; ESLint `browser` env và rules mới.
- Chuẩn hóa line endings `src/**/*.ts` sang LF.
- `docs/README.md`: mô tả contributing khớp GitFlow (không PR cho feature).

## [1.0.0] - 2025-09-13

### Added

- Phát hành ổn định đầu tiên của gotiengviet-js.
- Hỗ trợ gõ tiếng Việt với Telex, VNI và VIQR.
- Phát hiện thông minh để tránh sửa email, URL và token giống mã nguồn.
- API công khai `VietnameseInput`: `getInstance`, `destroyInstance`, `enable`, `disable`, `toggle`, `setInputMethod`, `getInputMethod`.
- Định nghĩa kiểu TypeScript và artifacts build Rollup.
- Unit test (Jest) và workflow CI.
