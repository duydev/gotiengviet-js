# Hướng dẫn đóng góp

Cảm ơn bạn quan tâm đến việc đóng góp cho **gotiengviet-js**!

## Quy trình chính

Dự án dùng **GitFlow**. Feature task được xử lý **tự động end-to-end** — merge trực tiếp vào `develop`, **không cần PR**.

**Workflow đầy đủ:** [feature-workflow.md](./feature-workflow.md)

| Bước | Hành động |
|------|-----------|
| 1 | Nhận yêu cầu |
| 2 | Phân tích & tạo tasks |
| 3 | Theo dõi & cập nhật trạng thái tasks |
| 4 | Implement |
| 5 | Format & lint |
| 6 | Cập nhật tài liệu |
| 7 | Stage → commit → merge `develop` → push |

## Thiết lập

```bash
git clone https://github.com/duydev/gotiengviet-js.git
cd gotiengviet-js
npm install
```

Chi tiết môi trường: [development.md](./development.md).

## Commit message

[Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Mục đích |
|--------|----------|
| `feat:` | Tính năng mới |
| `fix:` | Sửa lỗi |
| `docs:` | Cập nhật tài liệu |
| `test:` | Thêm/sửa test |
| `chore:` | Build, CI, dependency |

## Trước khi merge vào develop

- [ ] `npm run format` — [formatter.md](./formatter.md)
- [ ] `npm run lint` — [linter.md](./linter.md)
- [ ] `npm test` && `npm run build`
- [ ] Test mới cho tính năng/sửa lỗi
- [ ] Cập nhật `docs/` và `docs/changelog.md` (`[Unreleased]`)

## Code style

- TypeScript strict cho code mới
- ESLint + Prettier — xem [linter.md](./linter.md), [formatter.md](./formatter.md)
- Logic transform thuần trong `src/core/transform.ts`
- Public exports tại `src/index.ts`

## Kiểm thử

Chi tiết: [testing.md](./testing.md).

## GitFlow & release

| Tài liệu | Nội dung |
|----------|----------|
| [gitflow.md](./gitflow.md) | Mô hình nhánh, merge policy |
| [feature-workflow.md](./feature-workflow.md) | Implement feature từng bước |
| [build-and-release.md](./build-and-release.md) | Release lên npm |

## Báo lỗi & đề xuất

- [Báo lỗi](./github/bug-report-template.md)
- [Đề xuất tính năng](./github/feature-request-template.md)

## Quy tắc ứng xử

[code-of-conduct.md](./code-of-conduct.md)
