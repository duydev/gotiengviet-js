# Changelog

Tất cả thay đổi đáng chú ý của dự án được ghi tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tài liệu `docs/business-flows.md` — 11 luồng nghiệp vụ chi tiết kèm sơ đồ Mermaid (tích hợp, gõ runtime, transform, GitFlow, CI/CD).

## [1.0.0] - 2025-09-13

### Added

- Phát hành ổn định đầu tiên của gotiengviet-js.
- Hỗ trợ gõ tiếng Việt với Telex, VNI và VIQR.
- Phát hiện thông minh để tránh sửa email, URL và token giống mã nguồn.
- API công khai `VietnameseInput`: `getInstance`, `destroyInstance`, `enable`, `disable`, `toggle`, `setInputMethod`, `getInputMethod`.
- Định nghĩa kiểu TypeScript và artifacts build Rollup.
- Unit test (Jest) và workflow CI.
