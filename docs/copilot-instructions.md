# Hướng dẫn cho AI Assistant (Copilot)

Tài liệu ngắn gọn, cập nhật cho contributor và trợ lý mã tự động làm việc trên repository này.

## Tổng quan dự án

- **Mục đích:** Thêm gõ tiếng Việt vào web app, mô phỏng Unikey/EVKey; hỗ trợ Telex, VNI, VIQR.
- **Public API:** Entry point chính `VietnameseInput` và các type công khai từ `src/index.ts`.

## Kiến trúc & pattern

| File | Trách nhiệm |
|------|-------------|
| `src/core/VietnameseInput.ts` | DOM/event wiring, singleton lifecycle, API instance |
| `src/core/transform.ts` | Pure string transformation (tone/diacritic) |
| `src/utils/*` | Helper nhỏ (vowel detection, caret/replace) |
| `src/constants.ts` | Quy tắc bộ gõ (`INPUT_METHODS`, `VIETNAMESE_CHARS`) |
| `src/types.ts` | `InputMethod`, `InputConfig`, `InputMethodRule` |

- `VietnameseInput` lắng nghe `input`, `compositionstart`, `compositionend` trên `document`.
- **Không** đưa DOM logic vào `transform.ts` — chỉ nhận/trả về string.

## Lệnh phát triển

```bash
npm run build   # Rollup → dist/
npm test        # Jest, jsdom
npm run lint    # ESLint
npm run format  # Prettier
```

> TypeScript 5.4.x trong repo. ESLint parser có thể cảnh báo với TS mới hơn.

## Quy ước test

- Test đặt tại `src/__tests__/*.test.ts`
- Pure functions trong `transform.ts` cần unit test edge case (multi-vowel, uppercase, tone priority)
- Integration test cho singleton và event handling trong `VietnameseInput.test.ts`

## Export

- Public exports tập trung `src/index.ts`
- Re-export helpers qua `src/utils/index.ts`

## Pattern đóng góp

| Thay đổi | Hành động |
|----------|-----------|
| Bộ gõ mới | Cập nhật `INPUT_METHODS` + test |
| Logic transform | Sửa `transform.ts` + unit test |
| Helper mới | Thêm `src/utils/` + export + test |

## Tương thích ngược

`processInput` và `applyTone` vẫn public cho test/legacy. Nếu thay đổi cấu trúc nội bộ, thêm shim và ghi deprecation trong changelog.

## Quality gate CI

```
npm ci → npm run build → npm test → npm run lint
```

## Cursor Agent

- Rules: `.cursor/rules/`
- Skills index: [.cursor/skills/README.md](../.cursor/skills/README.md)
- Orchestrator: `implement-feature-task` (7 phase skills)
- Maintain docs: `maintain-docs` (audit toàn bộ `docs/`)
- Feature workflow: [feature-workflow.md](./feature-workflow.md)
- Entry point: [AGENTS.md](../AGENTS.md)

## Khác

- Chỉ TypeScript, không thêm runtime dependency
- Conventional Commits cho message
- Tài liệu đầy đủ trong `docs/` — xem [README.md](./README.md)
