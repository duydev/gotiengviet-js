# Bộ gõ (Input Methods)

gotiengviet-js hỗ trợ ba bộ gõ tiêu chuẩn phổ biến tại Việt Nam. Quy tắc được định nghĩa trong `src/constants.ts` dưới dạng `INPUT_METHODS`.

## Cấu trúc quy tắc

Mỗi bộ gõ gồm hai nhóm:

| Nhóm | Mô tả | Ví dụ |
|------|-------|-------|
| `toneRules` | Phím kích hoạt dấu thanh → chỉ số tone (0–5) | Telex: `s` → sắc (1) |
| `markRules` | Chuỗi ký tự → ký tự có dấu mũ/đặc biệt | Telex: `aa` → `â` |

### Chỉ số dấu thanh

| Index | Dấu | Tên |
|-------|-----|-----|
| 0 | nguyên âm gốc | không dấu |
| 1 | ´ | sắc |
| 2 | ` | huyền |
| 3 | ̉ | hỏi |
| 4 | ̃ | ngã |
| 5 | ̣ | nặng |

---

## Telex

Bộ gõ mặc định, phổ biến nhất trên Linux/macOS và nhiều ứng dụng web.

### Dấu mũ / ký tự đặc biệt

| Gõ | Kết quả | Gõ | Kết quả |
|----|---------|----|---------|
| `aa` | `â` | `AA` | `Â` |
| `aw` | `ă` | `AW` | `Ă` |
| `ee` | `ê` | `EE` | `Ê` |
| `oo` | `ô` | `OO` | `Ô` |
| `ow` | `ơ` | `OW` | `Ơ` |
| `uw` | `ư` | `UW` | `Ư` |
| `dd` | `đ` | `DD` | `Đ` |
| `w` (sau nguyên âm) | `ư` | — | — |

### Dấu thanh

| Phím | Dấu | Ví dụ |
|------|-----|-------|
| `s` | sắc | `bas` → `bá` |
| `f` | huyền | `baf` → `bà` |
| `r` | hỏi | `bar` → `bả` |
| `x` | ngã | `bax` → `bã` |
| `j` | nặng | `baj` → `bạ` |
| `z` | bỏ dấu | `báz` → `ba` |

### Ví dụ

```
Gõ:     tieengs vieetj nam
Kết quả: tiếng việt nam

Gõ:     ddawng luwowsc
Kết quả: đường lược
```

---

## VNI

Bộ gõ dùng số, quen thuộc với người dùng Windows (Unikey mode VNI).

### Dấu mũ / ký tự đặc biệt

| Gõ | Kết quả | Gõ | Kết quả |
|----|---------|----|---------|
| `a6` | `â` | `A6` | `Â` |
| `a8` | `ă` | `A8` | `Ă` |
| `e6` | `ê` | `E6` | `Ê` |
| `o6` | `ô` | `O6` | `Ô` |
| `o7` | `ơ` | `O7` | `Ơ` |
| `u7` | `ư` | `U7` | `Ư` |
| `d9` | `đ` | `D9` | `Đ` |

### Dấu thanh

| Phím | Dấu | Ví dụ |
|------|-----|-------|
| `1` | sắc | `ba1` → `bá` |
| `2` | huyền | `ba2` → `bà` |
| `3` | hỏi | `ba3` → `bả` |
| `4` | ngã | `ba4` → `bã` |
| `5` | nặng | `ba5` → `bạ` |
| `0` | bỏ dấu | `ba0` → `ba` |

### Ví dụ

```
Gõ:     tieeng5 vieetj5 nam
Kết quả: tiếng việt nam
```

---

## VIQR

Bộ gõ dùng ký tự đặc biệt, phổ biến trong email và văn bản ASCII.

### Dấu mũ / ký tự đặc biệt

| Gõ | Kết quả | Gõ | Kết quả |
|----|---------|----|---------|
| `a^` | `â` | `A^` | `Â` |
| `a(` | `ă` | `A(` | `Ă` |
| `e^` | `ê` | `E^` | `Ê` |
| `o^` | `ô` | `O^` | `Ô` |
| `o+` | `ơ` | `O+` | `Ơ` |
| `u+` | `ư` | `U+` | `Ư` |
| `dd` | `đ` | `DD` | `Đ` |

### Dấu thanh

| Phím | Dấu | Ví dụ |
|------|-----|-------|
| `'` | sắc | `b'a` → `bá` |
| `` ` `` | huyền | `` b`a `` → `bà` |
| `?` | hỏi | `b?a` → `bả` |
| `~` | ngã | `b~a` → `bã` |
| `.` | nặng | `b.a` → `bạ` |
| `^` | bỏ dấu | `b^a` → `ba` |

### Ví dụ

```
Gõ:     tieeng' vieetj. nam
Kết quả: tiếng việt nam
```

---

## Ưu tiên dấu thanh

Khi từ có nhiều nguyên âm, dấu thanh được đặt theo quy tắc tiếng Việt:

**Thứ tự ưu tiên nguyên âm:**

```
a > ă > â > o > ô > ơ > e > ê > u > ư > i > y
```

**Ví dụ:**

| Gõ (Telex) | Phân tích | Kết quả |
|------------|-----------|---------|
| `hoas` | dấu sắc trên `o` | `hóa` |
| `nguoiwf` | dấu huyền trên `u` | `người` |
| `tuowng` | `uo` → `ươ` | `tương` |

## Xử lý chữ hoa

- Mark rules có cặp lowercase/uppercase (`aa`/`AA`, `dd`/`DD`)
- Khi segment khớp có chữ hoa đầu, áp dụng mapping uppercase tương ứng
- Tone: nếu toàn từ viết hoa, dùng bảng `VIETNAMESE_CHARS` uppercase

## Chuẩn hóa đặc biệt

Sau mark rules, engine chuẩn hóa:

```
u + ơ → ươ
U + Ơ → ƯƠ
```

## Phát hiện nội dung không phải tiếng Việt

`VietnameseInput.handleInput` gọi `shouldRestoreNonViet` trước khi transform — tránh biến đổi:

- Địa chỉ email (`user@example.com`)
- URL (`https://...`)
- Tên biến lập trình (`myVariable`, `snake_case`)

## Thêm bộ gõ mới (cho contributor)

1. Thêm key vào type `InputMethod` trong `src/types.ts`
2. Thêm entry trong `INPUT_METHODS` tại `src/constants.ts`
3. Viết test trong `src/__tests__/`
4. Cập nhật tài liệu này

Xem thêm: [development.md](./development.md)
