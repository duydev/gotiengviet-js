# Tham chiếu API

## Exports

```typescript
import {
  VietnameseInput,
  processInputByMethod,
  applyToneToText,
} from 'gotiengviet';
import type { InputConfig, InputMethod } from 'gotiengviet';
```

| Export | Loại | Mô tả |
|--------|------|-------|
| `VietnameseInput` | Class | Singleton gắn DOM events |
| `processInputByMethod` | Function | Transform chuỗi theo bộ gõ (headless) |
| `applyToneToText` | Function | Gán dấu thanh trực tiếp (headless) |
| `InputConfig`, `InputMethod` | Types | Cấu hình và bộ gõ |

---

## Pure functions (headless)

Dùng khi không cần DOM — CLI, server, test ngoài browser:

### `processInputByMethod(text, method): string`

Áp dụng quy tắc bộ gõ (tone + mark) lên chuỗi. `method` lấy từ `INPUT_METHODS` nội bộ hoặc object tương thích `InputMethodRule`.

```typescript
import { processInputByMethod } from 'gotiengviet';
// Cần import constants nội bộ nếu dùng trực tiếp — hoặc truyền rule tùy chỉnh
```

### `applyToneToText(text, toneIndex): string`

Gán dấu thanh (0–5) lên nguyên âm theo priority tiếng Việt.

```typescript
applyToneToText('hoa', 1); // 'hoá'
```

---

## Types

### `InputMethod`

```typescript
type InputMethod = 'telex' | 'vni' | 'viqr';
```

Định danh bộ gõ được hỗ trợ.

### `InputConfig`

```typescript
interface InputConfig {
  enabled?: boolean;      // Mặc định: true
  inputMethod?: InputMethod; // Mặc định: 'telex'
}
```

Cấu hình khi khởi tạo instance.

---

## Class `VietnameseInput`

### Static Methods

#### `getInstance(config?: InputConfig): VietnameseInput`

Trả về singleton instance. Tạo mới nếu chưa tồn tại.

```typescript
const vi = VietnameseInput.getInstance({ inputMethod: 'telex', enabled: true });
```

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `config` | `InputConfig` | Cấu hình tùy chọn (chỉ áp dụng lần tạo đầu) |

**Trả về:** `VietnameseInput` — singleton instance

---

#### `destroyInstance(): void`

Hủy singleton: gỡ event listener và đặt instance về `null`.

```typescript
VietnameseInput.destroyInstance();
```

**Dùng khi:** unmount SPA component, chuyển trang, hoặc sau unit test.

---

### Instance Methods

#### `isEnabled(): boolean`

Kiểm tra gõ tiếng Việt có đang bật.

```typescript
vi.isEnabled(); // true | false
```

---

#### `enable(): void`

Bật gõ tiếng Việt.

```typescript
vi.enable();
```

---

#### `disable(): void`

Tắt gõ tiếng Việt (listener vẫn active, nhưng bỏ qua transform).

```typescript
vi.disable();
```

---

#### `toggle(): void`

Đảo trạng thái enable/disable.

```typescript
vi.toggle();
```

---

#### `getInputMethod(): InputMethod`

Lấy bộ gõ hiện tại.

```typescript
vi.getInputMethod(); // 'telex' | 'vni' | 'viqr'
```

---

#### `setInputMethod(method: InputMethod): void`

Đổi bộ gõ. Bỏ qua nếu `method` không hợp lệ.

```typescript
vi.setInputMethod('vni');
```

| Tham số | Kiểu | Giá trị hợp lệ |
|---------|------|----------------|
| `method` | `InputMethod` | `'telex'`, `'vni'`, `'viqr'` |

---

#### `destroy(): void`

Gỡ tất cả event listener khỏi `document`. Không reset singleton — dùng `destroyInstance()` cho singleton.

```typescript
vi.destroy();
```

---

### Compatibility Methods

Các method sau được expose cho test và tương thích ngược. **Không khuyến nghị** dùng trong ứng dụng production.

#### `processInput(text: string, method: InputMethodRule): string`

Chuyển đổi chuỗi theo quy tắc bộ gõ (delegate tới `processInputByMethod`).

#### `applyTone(text: string, toneIndex: number): string`

Áp dấu thanh lên nguyên âm (delegate tới `applyToneToText`).

---

## Constructor

```typescript
new VietnameseInput(config?: InputConfig)
```

Tạo instance độc lập. **Không khuyến nghị** — dùng `getInstance()` thay thế.

```typescript
const custom = new VietnameseInput({ inputMethod: 'vni' });
custom.destroy(); // cleanup thủ công
```

---

## Hành vi sự kiện

| Sự kiện | Target | Hành vi |
|---------|--------|---------|
| `input` | `document` | Xử lý chuyển đổi khi gõ |
| `compositionstart` | `document` | Đặt `composing = true`, bỏ qua transform |
| `compositionend` | `document` | Đặt `composing = false` |

### Điều kiện bỏ qua transform

Transform **không** chạy khi:

- `enabled === false`
- Đang trong composition (IME)
- Từ cuối có ít hơn 2 ký tự
- Kết quả transform giống input gốc

### Phạm vi element

Xử lý `event.target` khi là một trong các loại sau:

| Loại | Điều kiện |
|------|-----------|
| `<input>` | `HTMLInputElement` hoặc object tương thích (có `value`, `selectionStart` / `setRangeText`) |
| `<textarea>` | `HTMLTextAreaElement` |
| `contenteditable` | `HTMLElement` với `contenteditable="true"` hoặc `isContentEditable === true` |

Với `contenteditable`, thư viện đọc/ghi qua `innerText` và Selection API để giữ vị trí con trỏ. Rich text editor phức tạp (nhiều node, định dạng inline) **chưa** được hỗ trợ đầy đủ.

---

## Ví dụ đầy đủ

```typescript
import { VietnameseInput } from 'gotiengviet';
import type { InputMethod } from 'gotiengviet';

// Khởi tạo
const vi = VietnameseInput.getInstance({
  enabled: true,
  inputMethod: 'telex',
});

// UI toggle
document.getElementById('toggle')?.addEventListener('click', () => {
  vi.toggle();
  console.log('Vietnamese input:', vi.isEnabled() ? 'ON' : 'OFF');
});

// Đổi bộ gõ
function switchMethod(method: InputMethod) {
  vi.setInputMethod(method);
}

// Cleanup khi rời trang
window.addEventListener('beforeunload', () => {
  VietnameseInput.destroyInstance();
});
```

---

## TypeScript IntelliSense

Package kèm `dist/index.d.ts`. Đảm bảo `tsconfig.json` của dự án có:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```
