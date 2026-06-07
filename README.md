# gotiengviet

[![npm version](https://img.shields.io/npm/v/gotiengviet.svg)](https://www.npmjs.com/package/gotiengviet)
[![license](https://img.shields.io/npm/l/gotiengviet.svg)](https://github.com/duydev/gotiengviet-js/blob/main/LICENSE)

**English:** Add Vietnamese typing to any web app — Telex, VNI, and VIQR. Zero runtime dependencies, TypeScript-ready.

**Tiếng Việt:** Thêm khả năng gõ tiếng Việt vào ứng dụng web — Telex, VNI, VIQR. Không phụ thuộc runtime, hỗ trợ TypeScript.

---

## Installation / Cài đặt

```bash
npm install gotiengviet
```

```bash
yarn add gotiengviet
# pnpm add gotiengviet
```

---

## Quick Start / Bắt đầu nhanh

### English

```typescript
import { VietnameseInput } from 'gotiengviet';

VietnameseInput.getInstance({
  inputMethod: 'telex', // 'telex' | 'vni' | 'viqr'
  enabled: true,
});

// Cleanup on SPA unmount or in tests
VietnameseInput.destroyInstance();
```

After initialization, all `<input>`, `<textarea>`, and `contenteditable="true"` elements on the page support Vietnamese typing automatically.

**Example:** type `tieengs vieetj` → `tiếng việt` (Telex)

### Tiếng Việt

```typescript
import { VietnameseInput } from 'gotiengviet';

VietnameseInput.getInstance({
  inputMethod: 'telex', // 'telex' | 'vni' | 'viqr'
  enabled: true,
});

// Dọn dẹp khi unmount SPA hoặc trong test
VietnameseInput.destroyInstance();
```

Sau khi khởi tạo, mọi `<input>`, `<textarea>` và phần tử `contenteditable="true"` trên trang sẽ tự động hỗ trợ gõ tiếng Việt.

**Ví dụ:** gõ `tieengs vieetj` → `tiếng việt` (Telex)

---

## Features / Tính năng

| English | Tiếng Việt |
|---------|------------|
| Telex, VNI, VIQR input methods | Ba bộ gõ Telex, VNI, VIQR |
| Global DOM listener (singleton) | Lắng nghe DOM toàn cục (singleton) |
| Smart skip for email, URL, code tokens | Bỏ qua email, URL, token giống mã nguồn |
| `contenteditable` support | Hỗ trợ `contenteditable` |
| Headless transform API | API transform không cần DOM |
| Zero runtime dependencies | Không phụ thuộc runtime |
| TypeScript definitions included | Kèm định nghĩa TypeScript |

---

## Input Methods / Bộ gõ

| Method | Example input | Output |
|--------|---------------|--------|
| **Telex** | `as` | `á` |
| **Telex** | `uw` | `ư` |
| **VNI** | `a1` | `á` |
| **VIQR** | `a'` | `á` |

Switch at runtime:

```typescript
const vi = VietnameseInput.getInstance();
vi.setInputMethod('vni');
vi.toggle(); // enable / disable
```

---

## React Example / Ví dụ React

```tsx
import { useEffect } from 'react';
import { VietnameseInput } from 'gotiengviet';

function App() {
  useEffect(() => {
    VietnameseInput.getInstance({ inputMethod: 'telex' });
    return () => VietnameseInput.destroyInstance();
  }, []);

  return <input placeholder="Type Vietnamese here / Gõ tiếng Việt tại đây" />;
}
```

---

## Headless API / API không DOM

Use outside the browser (CLI, tests, server-side string processing):

```typescript
import { processInputByMethod, applyToneToText } from 'gotiengviet';

applyToneToText('hoa', 1); // 'hoá'
```

---

## API Summary / Tóm tắt API

| Export | Description / Mô tả |
|--------|---------------------|
| `VietnameseInput` | Singleton class for DOM integration |
| `VietnameseInput.getInstance(config?)` | Get or create instance |
| `VietnameseInput.destroyInstance()` | Remove listeners and reset |
| `enable()` / `disable()` / `toggle()` | Control typing at runtime |
| `setInputMethod()` / `getInputMethod()` | Switch Telex / VNI / VIQR |
| `processInputByMethod()` | Pure string transform |
| `applyToneToText()` | Apply tone mark to vowel |
| `InputConfig`, `InputMethod` | TypeScript types |

Full reference: [docs/api-reference.md](./docs/api-reference.md)

---

## Requirements / Yêu cầu

- **Browser:** ES2018+, `setRangeText` support
- **Node.js** (development): >= 18.0.0

---

## Documentation / Tài liệu

| | |
|---|---|
| **Full docs (Vietnamese)** | [docs/README.md](./docs/README.md) |
| **Getting started** | [docs/getting-started.md](./docs/getting-started.md) |
| **Input methods** | [docs/input-methods.md](./docs/input-methods.md) |
| **Changelog** | [docs/changelog.md](./docs/changelog.md) |

---

## License

[MIT](./LICENSE)

---

## Author / Tác giả

**Trần Nhật Duy** &lt;duytn.hcm@gmail.com&gt;

- GitHub: [@duydev](https://github.com/duydev)
- Repository: [duydev/gotiengviet-js](https://github.com/duydev/gotiengviet-js)
