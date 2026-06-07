# Cursor Skills — gotiengviet-js

Skills map to [docs/feature-workflow.md](../../docs/feature-workflow.md).

## Feature workflow (7 phases)

| Phase | Skill | Mô tả |
|-------|-------|-------|
| Orchestrator | `implement-feature-task` | Chạy toàn bộ 7 phase |
| 1 | `receive-feature-requirement` | Nhận và cấu trúc yêu cầu |
| 2 | `analyze-feature-tasks` | Khảo sát code, tạo danh sách tasks |
| 3 | `track-feature-tasks` | Theo dõi trạng thái tasks |
| 4 | `implement-feature-code` | Viết code + test + feature branch |
| 5 | `run-quality-gate` | format → lint → test → build |
| 6 | `sync-feature-docs` | Cập nhật docs/ + changelog |
| 7 | `gitflow-feature-merge` | commit → merge develop → push |

## Documentation

| Skill | Khi dùng |
|-------|----------|
| `sync-feature-docs` | Cập nhật docs khi implement feature (phase 6) |
| `maintain-docs` | Audit & maintain toàn bộ docs/ khớp với dự án |

## Domain skills

| Skill | Khi dùng |
|-------|----------|
| `vietnamese-transform` | Sửa logic tone/mark trong transform.ts |
| `add-input-method` | Thêm/sửa quy tắc Telex, VNI, VIQR |
| `gotiengviet-release` | Bump version, publish npm |

## Cách gọi

```
implement-feature-task          # full workflow
maintain-docs                   # audit & sync toàn bộ docs/
sync-feature-docs               # cập nhật docs cho 1 feature
run-quality-gate                # chỉ kiểm tra chất lượng
gitflow-feature-merge           # chỉ git merge
```
