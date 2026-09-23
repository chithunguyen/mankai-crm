# Mankai Education CRM

Giao diện CRM nội bộ Mankai Academy: quản lý hành trình học viên
Data → Sale → Đăng ký → Thanh toán → Khai giảng → Học tập → Kết quả → Học tiếp.

> **Dashboard** đọc dữ liệu thật từ Google Sheet (đăng nhập Google, không cần backend) —
> xem [hướng dẫn kết nối](docs/HUONG-DAN-GOOGLE-SHEET.md). Các trang khác vẫn dùng dữ liệu demo.

## Công nghệ

| Phần | Công nghệ | Chi phí |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | 0đ |
| Điều hướng | React Router (HashRouter) | 0đ |
| Hosting | GitHub Pages, tự deploy bằng GitHub Actions | 0đ |
| Dữ liệu (tạm thời) | Google Sheet + Sheets API, đăng nhập Google (OAuth) | 0đ |
| Backend (giai đoạn sau) | Supabase: Postgres + Auth + Row Level Security | 0đ (free tier) |

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build ra thư mục dist/
npm test           # kiểm tra công thức tính dashboard
npm run template   # tạo lại file Sheet mẫu public/mankai-crm-template.xlsx
```

Cấu hình Google (không bắt buộc, nhập được trên giao diện): copy `.env.example` thành `.env.local` và điền.

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
tự build và đăng lên GitHub Pages.

## Cấu trúc thư mục

```
src/
├── types.ts              # Kiểu dữ liệu (hợp đồng UI ↔ API)
├── data/mock/            # Dữ liệu demo — sửa số liệu ở đây
├── services/api.ts       # Lớp truy cập dữ liệu — sau này thay bằng gọi Supabase/API
├── sheets/               # Kết nối Google Sheet
│   ├── schema.ts         #   Cấu trúc tab/cột (nguồn duy nhất cho code + file mẫu)
│   ├── google.ts         #   Đăng nhập Google, gọi Sheets API
│   ├── parse.ts          #   Đọc ngày/số, kiểm tra thiếu tab/cột
│   ├── compute.ts        #   Công thức tính KPI, phễu, cảnh báo
│   └── SheetProvider.tsx #   Trạng thái kết nối, tự làm mới 5 phút
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

1. **Giai đoạn 1:** Giao diện + dữ liệu demo, deploy GitHub Pages.
1b. **Hiện tại:** Dashboard đọc dữ liệu thật từ Google Sheet.
2. **Giai đoạn 2:** Chốt nghiệp vụ → thiết kế database (học viên, lead, lớp, giao dịch, task...).
3. **Giai đoạn 3:** Kết nối Supabase: đăng nhập, phân quyền theo vai trò (CEO / Vận hành / Sale / Đào tạo / Kế toán)
   bằng Row Level Security, thay các hàm trong `services/api.ts` bằng truy vấn thật.
4. **Giai đoạn 4:** Audit log thật, import data, đồng bộ Lark, thông báo tự động.
