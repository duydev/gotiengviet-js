# Tổng quan dự án

## Giới thiệu

**gotiengviet-js** (tên npm: `gotiengviet`) là thư viện JavaScript/TypeScript giúp thêm khả năng gõ tiếng Việt vào bất kỳ ứng dụng web nào — không cần extension trình duyệt hay công cụ cấp hệ điều hành.

Thư viện mô phỏng trải nghiệm gõ quen thuộc của [Unikey](https://www.unikey.org/) và [EVKey](https://evkeyvn.com/), hỗ trợ ba bộ gõ phổ biến: **Telex**, **VNI** và **VIQR**.

## Động lực phát triển

Dự án ra đời để giải quyết nhu cầu thực tế của người dùng và developer Việt Nam: gõ tiếng Việt nhanh, chính xác trên mọi web app mà không phụ thuộc extension trình duyệt hay công cụ cấp hệ điều hành. Mục tiêu là tích hợp chỉ với một dòng code — zero dependency, đơn giản, tương thích mọi framework hoặc JavaScript thuần.

## Vấn đề giải quyết

| Vấn đề | Giải pháp của gotiengviet-js |
|--------|------------------------------|
| Người dùng web không có bộ gõ tiếng Việt | Lắng nghe sự kiện `input` toàn cục và chuyển đổi ký tự tự động |
| Tích hợp phức tạp với từng framework | Một dòng khởi tạo singleton, hoạt động với mọi `<input>` / `<textarea>` |
| Phụ thuộc nặng | Zero runtime dependency, bundle nhỏ |
| Thiếu type safety | Kèm định nghĩa TypeScript đầy đủ |

## Tính năng chính

- Hỗ trợ tất cả trường nhập liệu HTML (`input`, `textarea`) và tương thích rich text editor
- Ba bộ gõ: Telex, VNI, VIQR — chuyển đổi runtime qua `setInputMethod()`
- Bật/tắt gõ tiếng Việt runtime (`enable`, `disable`, `toggle`)
- Xử lý `compositionstart` / `compositionend` để tránh xung đột IME
- Phát hiện thông minh: bỏ qua email, URL, tên biến (code-like tokens)
- TypeScript strict mode, không phụ thuộc runtime

## Phạm vi (Scope)

### Trong phạm vi

- Chuyển đổi ký tự tiếng Việt theo quy tắc bộ gõ
- Quản lý vòng đời singleton trên trang web
- Build UMD (trình duyệt) và ESM (bundler hiện đại)

### Ngoài phạm vi

- Gõ tiếng Việt trên môi trường Node.js (không có DOM)
- Hỗ trợ `contenteditable` / rich text editor phức tạp (chưa hỗ trợ đầy đủ)
- Bộ gõ tùy chỉnh do người dùng định nghĩa (chỉ hỗ trợ 3 bộ gõ cố định)
- Gợi ý từ, từ điển, hoặc xử lý ngôn ngữ tự nhiên

## Thông tin kỹ thuật

| Thuộc tính | Giá trị |
|------------|---------|
| Tên package | `gotiengviet` |
| Phiên bản hiện tại | 1.0.0 |
| Ngôn ngữ | TypeScript 5.4 |
| Target | ES2018, DOM |
| Node.js tối thiểu | >= 14.0.0 |
| Giấy phép | MIT |
| Tác giả | Tran Nhat Duy |

## Cấu trúc repository

```
gotiengviet-js/
├── src/                    # Mã nguồn TypeScript
│   ├── core/               # Logic chính (DOM + transform)
│   ├── utils/              # Tiện ích chuỗi và DOM
│   ├── __tests__/          # Unit & integration tests
│   ├── constants.ts        # Quy tắc bộ gõ và bảng ký tự
│   ├── types.ts            # Định nghĩa kiểu công khai
│   └── index.ts            # Entry point công khai
├── dist/                   # Artifacts sau build (UMD + ESM + .d.ts)
├── example/                # Trang demo HTML
├── docs/                   # Tài liệu kỹ thuật (thư mục này)
├── .github/workflows/      # CI và publish pipeline
└── package.json
```

## Đối tượng sử dụng

1. **Nhà phát triển frontend** — tích hợp gõ tiếng Việt vào form, chat, editor
2. **Dự án React/Vue/Angular** — khởi tạo singleton trong lifecycle hook
3. **Trang web tĩnh** — import UMD bundle trực tiếp
4. **Người đóng góp mã nguồn** — mở rộng logic transform hoặc thêm bộ gõ

## Lời cảm ơn

Lấy cảm hứng từ [Unikey](https://www.unikey.org/), [EVKey](https://evkeyvn.com/) và các phương thức nhập tiếng Việt khác.
