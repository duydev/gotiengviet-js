# Bắt đầu nhanh

## Yêu cầu

- Node.js >= 14.0.0 (cho development)
- Trình duyệt hiện đại hỗ trợ ES2018 và `setRangeText`
- Bundler (tùy chọn): Webpack, Vite, Rollup, Parcel

## Cài đặt

```bash
npm install gotiengviet
```

Hoặc:

```bash
yarn add gotiengviet
pnpm add gotiengviet
```

## Sử dụng cơ bản

```typescript
import { VietnameseInput } from 'gotiengviet';

// Khởi tạo singleton (khuyến nghị)
const vietnameseInput = VietnameseInput.getInstance({
  inputMethod: 'telex', // 'telex' | 'vni' | 'viqr'
  enabled: true,
});

// Tắt khi rời trang (SPA) hoặc trong test
VietnameseInput.destroyInstance();
```

Sau khi khởi tạo, mọi `<input>` và `<textarea>` trên trang sẽ tự động hỗ trợ gõ tiếng Việt.

## Tích hợp framework

### React

```tsx
import { useEffect } from 'react';
import { VietnameseInput } from 'gotiengviet';

function App() {
  useEffect(() => {
    VietnameseInput.getInstance({ inputMethod: 'telex' });
    return () => VietnameseInput.destroyInstance();
  }, []);

  return <input placeholder="Gõ tiếng Việt tại đây..." />;
}
```

### Vue 3

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { VietnameseInput } from 'gotiengviet';

onMounted(() => {
  VietnameseInput.getInstance({ inputMethod: 'telex' });
});

onUnmounted(() => {
  VietnameseInput.destroyInstance();
});
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VietnameseInput } from 'gotiengviet';

@Component({ /* ... */ })
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    VietnameseInput.getInstance({ inputMethod: 'telex' });
  }

  ngOnDestroy() {
    VietnameseInput.destroyInstance();
  }
}
```

## Sử dụng UMD (không bundler)

```html
<script src="node_modules/gotiengviet/dist/index.js"></script>
<script>
  const vi = GoTiengViet.VietnameseInput.getInstance({ inputMethod: 'telex' });
</script>
```

## Demo cục bộ

Repository có sẵn trang demo tại `example/index.html`:

```bash
# Build thư viện trước
npm run build

# Chạy static server
npm run serve

# Mở http://localhost:3000/example/
```

## Cấu hình

```typescript
interface InputConfig {
  /** Bật/tắt gõ tiếng Việt khi khởi tạo (mặc định: true) */
  enabled?: boolean;

  /** Bộ gõ: 'telex' | 'vni' | 'viqr' (mặc định: 'telex') */
  inputMethod?: InputMethod;
}
```

### Đổi bộ gõ runtime

```typescript
const vi = VietnameseInput.getInstance();

vi.setInputMethod('vni');
console.log(vi.getInputMethod()); // 'vni'
```

### Bật/tắt runtime

```typescript
vi.disable();   // Tạm tắt gõ tiếng Việt
vi.enable();    // Bật lại
vi.toggle();    // Đảo trạng thái
vi.isEnabled(); // Kiểm tra trạng thái
```

## Ví dụ gõ

| Bộ gõ | Gõ | Kết quả |
|-------|-----|---------|
| Telex | `tieengs vieetj` | `tiếng việt` |
| VNI | `tieeng5 vieetj5` | `tiếng việt` |
| VIQR | `tieeng' vieetj.` | `tiếng việt` |

Chi tiết quy tắc từng bộ gõ: [input-methods.md](./input-methods.md).

## Lưu ý quan trọng

1. **Singleton** — `getInstance()` luôn trả về cùng instance; config chỉ áp dụng lần tạo đầu tiên
2. **Cleanup** — gọi `destroyInstance()` khi unmount component trong SPA để tránh memory leak
3. **IME** — thư viện tự bỏ qua khi `compositionstart` đang active (tránh xung đột bộ gõ hệ thống)
4. **Từ tối thiểu** — chỉ xử lý khi từ cuối có >= 2 ký tự

## Bước tiếp theo

- [Tham chiếu API](./api-reference.md) — toàn bộ method và type
- [Bộ gõ](./input-methods.md) — bảng quy tắc chi tiết
- [Kiến trúc](./architecture.md) — hiểu cách thư viện hoạt động bên trong
