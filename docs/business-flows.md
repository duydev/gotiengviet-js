# Luồng nghiệp vụ (Business Flows)

Tài liệu mô tả chi tiết các **luồng nghiệp vụ** của gotiengviet-js — từ góc nhìn người dùng cuối, runtime, thuật toán chuyển đổi, và quy trình phát triển/phát hành.

Mỗi luồng kèm **sơ đồ Mermaid** để dễ đọc và bảo trì.

## Mục lục luồng

| # | Luồng | Đối tượng |
|---|-------|-----------|
| 1 | [Tích hợp thư viện](#1-luồng-tích-hợp-thư-viện) | Developer |
| 2 | [Gõ tiếng Việt (runtime)](#2-luồng-gõ-tiếng-việt-runtime) | End user |
| 3 | [Vòng đời Singleton](#3-luồng-vòng-đời-singleton) | Runtime |
| 4 | [IME Composition](#4-luồng-ime-composition) | Runtime |
| 5 | [Pipeline chuyển đổi ký tự](#5-luồng-pipeline-chuyển-đổi-ký-tự) | Thuật toán |
| 6 | [Áp dấu thanh](#6-luồng-áp-dấu-thanh) | Thuật toán |
| 7 | [Thay thế text trên DOM](#7-luồng-thay-thế-text-trên-dom) | Runtime |
| 8 | [Đổi bộ gõ runtime](#8-luồng-đổi-bộ-gõ-runtime) | End user / Developer |
| 9 | [Phát triển feature](#9-luồng-phát-triển-feature) | Contributor |
| 10 | [GitFlow & phát hành](#10-luồng-gitflow--phát-hành) | Maintainer |
| 11 | [CI/CD](#11-luồng-cicd) | Hệ thống |

---

## 1. Luồng tích hợp thư viện

Developer tích hợp gotiengviet vào ứng dụng web.

```mermaid
flowchart TD
    A[Cài đặt npm install gotiengviet] --> B[Import VietnameseInput]
    B --> C{Framework?}
    C -->|React| D[useEffect → getInstance]
    C -->|Vue| E[onMounted → getInstance]
    C -->|Angular| F[ngOnInit → getInstance]
    C -->|Plain JS| G[getInstance trực tiếp]
    D --> H[Cấu hình InputConfig]
    E --> H
    F --> H
    G --> H
    H --> I{enabled: true?}
    I -->|Có| J[Lắng nghe input trên document]
    I -->|Không| K[Listener active nhưng bỏ qua transform]
    J --> L[User gõ tiếng Việt trên input/textarea]
    K --> M[Có thể enable() sau]
    L --> N{SPA unmount?}
    M --> N
    N -->|Có| O[destroyInstance]
    N -->|Không| L
```

### Các bước chi tiết

| Bước | Hành động | API |
|------|-----------|-----|
| 1 | Cài package | `npm install gotiengviet` |
| 2 | Khởi tạo singleton | `VietnameseInput.getInstance(config)` |
| 3 | Tùy chọn đổi bộ gõ | `setInputMethod('telex' \| 'vni' \| 'viqr')` |
| 4 | Tùy chọn bật/tắt | `enable()` / `disable()` / `toggle()` |
| 5 | Cleanup khi rời trang | `VietnameseInput.destroyInstance()` |

Chi tiết code: [getting-started.md](./getting-started.md).

---

## 2. Luồng gõ tiếng Việt (runtime)

Luồng nghiệp vụ chính khi người dùng gõ trên `<input>` hoặc `<textarea>`.

```mermaid
flowchart TD
    A[User gõ phím] --> B[Browser fire input event]
    B --> C[VietnameseInput.handleInput]
    C --> D{enabled?}
    D -->|Không| Z[Bỏ qua — giữ nguyên text]
    D -->|Có| E{composing?}
    E -->|Có — IME đang active| Z
    E -->|Không| F{target là input/textarea?}
    F -->|Không| Z
    F -->|Có| G[getLastWord tại cursor]
    G --> H{lastWord.length >= 2?}
    H -->|Không| Z
    H -->|Có| I[Lấy INPUT_METHODS theo config]
    I --> J[processInputByMethod]
    J --> K{processed !== lastWord?}
    K -->|Không| Z
    K -->|Có| L[replaceText trên DOM]
    L --> M[Hiển thị ký tự tiếng Việt]
```

### Ví dụ luồng (Telex)

```
User gõ: h → o → a → s
         │   │   │   └── tone key 's' → sắc
         │   │   └────── nguyên âm 'a'
         └───┴────────── từ "hoas"

processInputByMethod("hoas", telex) → "hóa"
replaceText: "hoas" → "hóa" tại vị trí từ cuối
```

### Điều kiện bỏ qua transform

| Điều kiện | Lý do nghiệp vụ |
|-----------|-----------------|
| `enabled = false` | User/dev tắt gõ tiếng Việt |
| `composing = true` | Tránh xung đột bộ gõ hệ thống (IME) |
| `lastWord.length < 2` | Chưa đủ ký tự để nhận diện từ |
| `processed === lastWord` | Không có thay đổi — không cập nhật DOM |

---

## 3. Luồng vòng đời Singleton

```mermaid
stateDiagram-v2
    [*] --> NotCreated: chưa gọi getInstance
    NotCreated --> Active: getInstance(config)
    Active --> Active: getInstance() — trả cùng instance
    Active --> Disabled: disable()
    Disabled --> Active: enable()
    Active --> Disabled: toggle()
    Disabled --> Disabled: toggle()
    Active --> Destroyed: destroyInstance()
    Destroyed --> Active: getInstance() — tạo mới
    note right of Active
        Listener trên document
        config.inputMethod
        config.enabled
    end note
```

### Quy tắc nghiệp vụ

- **Một instance** trên mỗi trang — tránh duplicate listener
- `getInstance()` lần 2+ **không** áp dụng config mới
- `destroyInstance()` gỡ listener — bắt buộc khi unmount SPA
- `destroy()` chỉ gỡ listener, không reset `_instance`

---

## 4. Luồng IME Composition

Xử lý khi bộ gõ hệ điều hành (IME) đang hoạt động.

```mermaid
sequenceDiagram
    participant User
    participant IME as OS IME
    participant DOM as document
    participant VI as VietnameseInput

    User->>IME: Bắt đầu gõ (Japanese/Chinese IME...)
    IME->>DOM: compositionstart
    DOM->>VI: handleCompositionStart
    VI->>VI: composing = true

    loop Trong composition
        User->>DOM: input events
        DOM->>VI: handleInput
        VI-->>DOM: return — bỏ qua transform
    end

    User->>IME: Xác nhận ký tự
    IME->>DOM: compositionend
    DOM->>VI: handleCompositionEnd
    VI->>VI: composing = false

    User->>DOM: Gõ tiếp
    DOM->>VI: handleInput — transform bình thường
```

---

## 5. Luồng pipeline chuyển đổi ký tự

`processInputByMethod` — engine xử lý chuỗi thuần.

```mermaid
flowchart TD
    A[Input: lastWord + InputMethodRule] --> B[Giai đoạn 1: Tone rules]
    B --> C{Quét từng ký tự}
    C --> D{Ký tự trong toneRules?}
    D -->|Không| C
    D -->|Có| E{Có nguyên âm bên trái?}
    E -->|Không| C
    E -->|Có| F[applyToneToText — xóa phím dấu, áp tone]
    F --> C
    C -->|Hết chuỗi| G[Giai đoạn 2: Mark rules]
    G --> H[Sắp key dài nhất trước]
    H --> I{lastIndexOf key trong text?}
    I -->|Không tìm thấy| J{changed trong vòng lặp?}
    I -->|Có| K[Thay key → ký tự có dấu mũ]
    K --> J
    J -->|Có thay đổi| H
    J -->|Không| L[Giai đoạn 3: Chuẩn hóa]
    L --> M[uơ → ươ, UƠ → ƯƠ]
    M --> N[Output: chuỗi đã chuyển đổi]
```

### Thứ tự xử lý (không đổi)

1. **Tone** — phím dấu thanh (s/f/r/x/j/z cho Telex)
2. **Mark** — chuỗi dấu mũ (aa→â, dd→đ, ...)
3. **Normalize** — ghép nguyên âm đặc biệt

Chi tiết quy tắc: [input-methods.md](./input-methods.md).

---

## 6. Luồng áp dấu thanh

`applyToneToText` — chọn nguyên âm nhận dấu thanh.

```mermaid
flowchart TD
    A[Input: text + toneIndex] --> B[findVowelPosition]
    B --> C{Có nguyên âm?}
    C -->|Không| D[Return text gốc]
    C -->|Có| E[Duyệt từng nguyên âm]
    E --> F[Tính rank theo priority list]
    F --> G[a > ă > â > o > ô > ơ > e > ê > u > ư > i > y]
    G --> H[Chọn nguyên âm rank thấp nhất]
    H --> I{Cùng rank?}
    I -->|Có| J[Chọn vị trí phải hơn]
    I -->|Không| K[Tra VIETNAMESE_CHARS]
    J --> K
    K --> L[Lấy ký tự tại toneIndex]
    L --> M[Thay thế nguyên âm → output]
```

### Ví dụ nghiệp vụ

| Input (Telex) | Nguyên âm được chọn | Output |
|---------------|---------------------|--------|
| `hoas` (s=sắc) | `o` trong `hoa` | `hóa` |
| `nguoiwf` (f=huyền) | `u` trong `uoi` | `người` |
| `bas` (s=sắc) | `a` | `bá` |
| `xi` + `x` tone | Không áp (không có vowel trái `x`) | `xi` |

---

## 7. Luồng thay thế text trên DOM

`replaceText` — cập nhật giá trị input mà giữ con trỏ.

```mermaid
flowchart TD
    A[replaceText element, newText, start, end] --> B[Lưu scrollTop]
    B --> C{Hỗ trợ setRangeText?}
    C -->|Có| D[setRangeText newText, start, end, end]
    C -->|Không| E[Manual splice value]
    D --> F[Đặt selectionStart/End = start + len]
    E --> F
    F --> G[Khôi phục scrollTop]
    G --> H[Con trỏ tại cuối từ đã thay]
```

### Phạm vi thay thế

Chỉ thay **từ cuối** tại vị trí con trỏ — không ảnh hưởng phần text trước đó.

```
value: "Xin chao ban "
cursor: ───────────────^
lastWord: "ban" → transform → "bạn"
result: "Xin chao bạn"
```

---

## 8. Luồng đổi bộ gõ runtime

```mermaid
flowchart TD
    A[User/Dev gọi setInputMethod] --> B{method hợp lệ?}
    B -->|telex/vni/viqr| C[Cập nhật config.inputMethod]
    B -->|khác| D[Bỏ qua — giữ method cũ]
    C --> E[Lần gõ tiếp theo]
    E --> F[INPUT_METHODS method mới]
    F --> G[processInputByMethod với rules mới]
```

### Ba bộ gõ

```mermaid
flowchart LR
    subgraph Telex
        T1[aa → â]
        T2[s → sắc]
    end
    subgraph VNI
        V1[a6 → â]
        V2[1 → sắc]
    end
    subgraph VIQR
        Q1[a^ → â]
        Q2[' → sắc]
    end
    Config[inputMethod] --> Telex
    Config --> VNI
    Config --> VIQR
```

---

## 9. Luồng phát triển feature

Contributor implement tính năng mới — merge trực tiếp `develop`, không PR.

```mermaid
flowchart TD
    A[Nhận yêu cầu] --> B[Phân tích & tạo tasks]
    B --> C[Theo dõi trạng thái tasks]
    C --> D[feature/* từ develop]
    D --> E[Implement + test]
    E --> F[format → lint → test → build]
    F --> G{Cả 4 pass?}
    G -->|Không| E
    G -->|Có| H[Cập nhật docs/ + changelog]
    H --> I[commit]
    I --> J[merge --no-ff → develop]
    J --> K[push develop]
    K --> L[Xóa feature branch]
```

Chi tiết: [feature-workflow.md](./feature-workflow.md).

---

## 10. Luồng GitFlow & phát hành

```mermaid
flowchart LR
    subgraph Development
        F[feature/*] -->|merge --no-ff| D[develop]
    end
    subgraph Release
        D --> R[release/x.y.z]
        R -->|tag v*| M[main]
        R -->|merge back| D
    end
    subgraph Hotfix
        M --> H[hotfix/*]
        H --> M
        H --> D
    end
    M -->|npm publish| N[npm registry]
```

| Nhánh | Mục đích | Merge |
|-------|----------|-------|
| `feature/*` | Tính năng mới | → `develop` (không PR) |
| `release/*` | Chuẩn bị version | → `main` + `develop` |
| `hotfix/*` | Sửa production khẩn | → `main` + `develop` |

Chi tiết: [gitflow.md](./gitflow.md), [build-and-release.md](./build-and-release.md).

---

## 11. Luồng CI/CD

```mermaid
flowchart TD
    subgraph CI["CI — push/PR main"]
        A1[checkout] --> A2[npm ci]
        A2 --> A3[lint]
        A3 --> A4[build]
        A4 --> A5[test]
        A5 --> A6{Node 16/18/20}
    end

    subgraph Publish["Publish — tag v*.*.*"]
        B1[checkout] --> B2[npm ci]
        B2 --> B3[lint + test + build]
        B3 --> B4[npm publish]
        B4 --> B5[registry.npmjs.org]
    end

    PushMain[push main] --> CI
    Tag[push tag v1.x.x] --> Publish
```

### Quality gate (local = CI)

```bash
npm run format && npm run lint && npm test && npm run build
```

---

## Sơ đồ tổng hợp hệ thống

Toàn cảnh các luồng nghiệp vụ chính trong một view:

```mermaid
flowchart TB
    subgraph UserLayer["Lớp người dùng"]
        Dev[Developer tích hợp]
        EndUser[End user gõ tiếng Việt]
    end

    subgraph AppLayer["Lớp ứng dụng"]
        VI[VietnameseInput Singleton]
        Config[InputConfig / InputMethod]
    end

    subgraph ProcessLayer["Lớp xử lý"]
        Event[Event Handler]
        Transform[Transform Engine]
        DOM[DOM Replace]
    end

    subgraph DataLayer["Lớp dữ liệu"]
        Rules[INPUT_METHODS]
        Chars[VIETNAMESE_CHARS]
    end

    subgraph DevOps["Lớp vận hành"]
        GitFlow[GitFlow develop → main]
        CI[CI/CD npm]
    end

    Dev --> VI
    Dev --> Config
    EndUser --> Event
    Config --> VI
    VI --> Event
    Event --> Transform
    Transform --> Rules
    Transform --> Chars
    Event --> DOM
    Dev --> GitFlow
    GitFlow --> CI
```

---

## Tài liệu liên quan

| Tài liệu | Nội dung |
|----------|----------|
| [architecture.md](./architecture.md) | Kiến trúc kỹ thuật, component diagram |
| [input-methods.md](./input-methods.md) | Bảng quy tắc bộ gõ |
| [api-reference.md](./api-reference.md) | API công khai |
| [feature-workflow.md](./feature-workflow.md) | Workflow implement feature |
| [gitflow.md](./gitflow.md) | Mô hình nhánh |
