# Mankai Education CRM

Giao diện CRM nội bộ Mankai Academy: quản lý hành trình học viên
Data → Sale → Đăng ký → Thanh toán → Khai giảng → Học tập → Kết quả → Học tiếp.

> Hiện tại là **prototype dùng dữ liệu demo** (chưa có backend / đăng nhập).

## Công nghệ

| Phần | Công nghệ | Chi phí |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | 0đ |
| Điều hướng | React Router (HashRouter) | 0đ |
| Hosting | GitHub Pages, tự deploy bằng GitHub Actions | 0đ |
| Backend (giai đoạn sau) | Supabase: Postgres + Auth + Row Level Security | 0đ (free tier) |

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build ra thư mục dist/
```

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
tự build và đăng lên GitHub Pages.

## Cấu trúc thư mục

```
src/
├── types.ts              # Kiểu dữ liệu (hợp đồng UI ↔ API)
├── data/mock/            # Dữ liệu demo — sửa số liệu ở đây
├── services/api.ts       # Lớp truy cập dữ liệu — sau này thay bằng gọi Supabase/API
├── hooks/useData.ts      # Hook tải dữ liệu từ api
├── config/navigation.ts  # Menu sidebar
├── modals/forms.ts       # Cấu hình field các form (thêm học viên, lead, task...)
├── components/
│   ├── layout/           # Sidebar, topbar, tìm kiếm nhanh
│   └── ui/               # Badge, KPI, bảng, progress, toast...
├── pages/                # Các màn hình, nhóm theo nghiệp vụ
└── styles/               # original.css (CSS gốc của prototype) + app.css
```

## Lộ trình

1. **Giai đoạn 1 (hiện tại):** Giao diện + dữ liệu demo, deploy GitHub Pages.
2. **Giai đoạn 2:** Chốt nghiệp vụ → thiết kế database (học viên, lead, lớp, giao dịch, task...).
3. **Giai đoạn 3:** Kết nối Supabase: đăng nhập, phân quyền theo vai trò (CEO / Vận hành / Sale / Đào tạo / Kế toán)
   bằng Row Level Security, thay các hàm trong `services/api.ts` bằng truy vấn thật.
4. **Giai đoạn 4:** Audit log thật, import data, đồng bộ Lark, thông báo tự động.
