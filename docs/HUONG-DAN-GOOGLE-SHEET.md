# Hướng dẫn kết nối Dashboard với Google Sheet

Dashboard đọc dữ liệu thật từ một file Google Sheet. Không có máy chủ trung gian: người dùng đăng nhập Google,
trình duyệt đọc Sheet bằng quyền của chính người đó rồi tự tính số liệu.

**Ai được xem dashboard = ai được chia sẻ quyền xem file Sheet.** Bỏ chia sẻ là mất quyền xem.

Các bước 1–2 chỉ làm **một lần**, mất khoảng 20 phút.

---

## Bước 1. Tạo file Google Sheet từ file mẫu

1. Tải file mẫu: [mankai-crm-template.xlsx](https://chithunguyen.github.io/mankai-crm/mankai-crm-template.xlsx)
   (file có sẵn dữ liệu mẫu để thử; xoá các dòng dữ liệu, giữ dòng tiêu đề khi nhập dữ liệu thật).
2. Mở [Google Drive](https://drive.google.com) → **Mới → Tải tệp lên** → chọn file vừa tải.
3. Mở file trên Drive → **Tệp → Lưu dưới dạng Google Trang tính**.
   > ⚠️ Bắt buộc. File `.xlsx` để nguyên trên Drive thì Google không cho đọc qua API.
4. Copy link của file Google Trang tính mới (dạng `https://docs.google.com/spreadsheets/d/.../edit`).

### Quy tắc nhập liệu

- Dòng 1 mỗi tab là tiêu đề. **Cột tiêu đề nền cam đậm là bắt buộc**: không đổi tên, không xoá.
  Được thêm cột riêng, đổi thứ tự cột, thêm tab khác.
- Không đổi tên các tab: `Lead`, `HocVien`, `DangKy`, `GiaoDich`, `LopHoc`, `CongViec`, `NhatKy`, `CauHinh`.
- Ngày nhập dạng `dd/mm/yyyy` (có giờ: `dd/mm/yyyy hh:mm`). Số tiền nhập số, không cần dấu chấm.
- Cột có dropdown (Trạng thái, Loại, Bộ phận…) chỉ chọn giá trị trong danh sách, gõ sai số liệu sẽ lệch.

| Tab | Mỗi dòng là |
|---|---|
| Lead | 1 data/lead. Lead chốt → đổi Trạng thái = *Đăng ký* và thêm dòng ở HocVien |
| HocVien | 1 học viên đã đăng ký |
| DangKy | 1 lần đăng ký khóa (1 học viên có thể học nhiều khóa) |
| GiaoDich | 1 lần thu/hoàn tiền. Số tiền nhập số dương; *Hoàn tiền* tự trừ; *Điều chỉnh* nhập âm để trừ |
| LopHoc | 1 lớp. Cột *Cần điều phối* ghi vấn đề (thiếu GV/TA/phòng), để trống nếu ổn |
| CongViec | 1 công việc |
| NhatKy | 1 hoạt động (hiển thị ở "Hoạt động gần đây") |
| CauHinh | Tham số tính toán (không bắt buộc) |

---

## Bước 2. Tạo Google OAuth Client ID (miễn phí)

Client ID cho phép trang web hiện nút "Đăng nhập Google". Nó **không phải mật khẩu**, để công khai cũng không sao.

1. Vào [Google Cloud Console](https://console.cloud.google.com) (đăng nhập bằng tài khoản quản trị của Mankai).
2. Góc trên bên trái → **chọn project → New project** → tên `Mankai CRM` → **Create**. Không cần nhập thẻ thanh toán.
3. Menu **APIs & Services → Library** → tìm **Google Sheets API** → **Enable**.
4. Menu **Google Auth Platform** (hoặc *APIs & Services → OAuth consent screen*) → **Get started**:
   - App name: `Mankai CRM`, User support email: email của bạn.
   - **Audience**:
     - Nhân viên dùng email công ty trên **Google Workspace** (vd. `@mankai.edu.vn`) → chọn **Internal**. Xong.
     - Nhân viên dùng **Gmail cá nhân** → chọn **External**. Sau đó vào mục **Audience → Test users → Add users**
       và thêm email từng người được xem dashboard (tối đa 100). Khi đăng nhập, Google sẽ hiện
       *"Google chưa xác minh ứng dụng này"* → bấm **Tiếp tục**. Đây là bình thường với ứng dụng nội bộ.
   - Contact email: email của bạn → **Create**.
5. Mục **Clients → Create client**:
   - Application type: **Web application**, Name: `Mankai CRM web`.
   - **Authorized JavaScript origins** → Add URI, thêm 2 dòng:
     - `https://chithunguyen.github.io`
     - `http://localhost:5173`
   - Để trống *Authorized redirect URIs* → **Create**.
6. Copy **Client ID** (dạng `123456-abc….apps.googleusercontent.com`).

---

## Bước 3. Kết nối

Có 2 cách:

- **Nhanh (thử ngay):** mở web → Dashboard → **Kết nối Google Sheet** → dán Client ID và link Sheet →
  **Đăng nhập Google & tải dữ liệu**. Cấu hình chỉ lưu trên trình duyệt đó.
- **Cố định cho mọi người:** vào repo GitHub → **Settings → Secrets and variables → Actions → Variables → New repository variable**:
  - `VITE_GOOGLE_CLIENT_ID` = Client ID
  - `VITE_SHEET_ID` = ID file Sheet (đoạn giữa `/d/` và `/edit` trong link)

  Sau đó vào tab **Actions → Deploy to GitHub Pages → Run workflow**. Từ đó mọi người chỉ cần bấm "Đăng nhập Google".

## Bước 4. Chia sẻ quyền xem

Trong Google Sheet → **Chia sẻ** → thêm email người được xem dashboard với quyền **Người xem**.

> Lưu ý: người được chia sẻ xem được **toàn bộ** các tab, kể cả doanh thu. Giai đoạn này chỉ nên chia sẻ cho người
> được xem toàn bộ số liệu. Muốn phân quyền theo vai trò (Sale chỉ thấy data của mình…) cần thêm backend.

---

## Dashboard tính số liệu như thế nào

"Tháng này" là tháng theo lịch của ngày hiện tại. Trạng thái so khớp không phân biệt hoa thường/dấu.

| Chỉ số | Cách tính |
|---|---|
| Tổng học viên | Số dòng tab HocVien. % so với số học viên có *Ngày tạo* trước tháng này |
| Đang học | Học viên *Trạng thái* = Đang học. "Mới tháng này" = có *Ngày tạo* trong tháng |
| Doanh thu tháng | Tổng *Giá trị khóa* (DangKy) có *Ngày đăng ký* trong tháng, so với tháng trước |
| Thu thực tế | Tổng *Số tiền* (GiaoDich) có *Thời gian* trong tháng; Hoàn tiền bị trừ |
| Data trong phễu | Lead chưa Đăng ký / Hủy; kèm số đang Tư vấn và Hot lead |
| Cần xử lý hôm nay | Công việc chưa *Hoàn thành* có *Hạn* đến hết hôm nay (gồm cả việc quá hạn) |
| Biểu đồ doanh thu | Doanh thu (như trên) của 6 tháng gần nhất |
| Phễu học viên | Số lead **đã đi tới** từng bước: Data mới = tất cả lead; các bước sau đếm lead có trạng thái từ bước đó trở đi (không tính Hủy) |
| Công việc hôm nay | 5 việc chưa xong có hạn sớm nhất. Nhãn: *Quá hạn* → *Ưu tiên* (Cao) → *Hôm nay* → tên bộ phận |
| Nguy cơ bỏ học | Học viên Đang học có *Chuyên cần* dưới **Ngưỡng chuyên cần** (mặc định 70%) |
| Hot lead quá hạn | Hot lead có *Ngày follow-up* đã qua hơn **SLA hot lead** ngày (mặc định 1) |
| Thanh toán sắp đến hạn | Đăng ký còn nợ (Giá trị khóa − tiền đã thu theo *Mã ĐK*) và *Hạn thanh toán* trong **Nhắc thanh toán trước** ngày tới (mặc định 3). Kèm số đã quá hạn |
| Lớp cần điều phối | Lớp chưa *Kết thúc* có ghi chú ở cột *Cần điều phối* |
| Hoạt động gần đây | 8 dòng mới nhất tab NhatKy |

Các tham số in đậm sửa được trong tab **CauHinh**.

Dữ liệu tự làm mới mỗi 5 phút khi đang mở trang, hoặc bấm **↻ Làm mới**. Phiên đăng nhập Google kéo dài khoảng 1 giờ,
hết hạn thì bấm **Đăng nhập lại**.

---

## Lỗi thường gặp

| Thông báo | Cách xử lý |
|---|---|
| Tài khoản này chưa được chia sẻ quyền xem Google Sheet | Chia sẻ Sheet cho email đang đăng nhập (Bước 4) |
| Không tìm thấy Google Sheet | Kiểm tra link; file phải là **Google Trang tính**, không phải `.xlsx` (Bước 1.3) |
| Google Sheets API chưa được bật | Làm lại Bước 2.3 |
| File Sheet chưa đúng cấu trúc: thiếu tab / thiếu cột | Đổi tên tab/cột đúng như file mẫu |
| Trình duyệt chặn cửa sổ đăng nhập | Cho phép popup cho trang `chithunguyen.github.io` |
| `Error 400: redirect_uri_mismatch` / `origin_mismatch` | Kiểm tra Authorized JavaScript origins ở Bước 2.5 |
| `Error 403: access_denied` (Gmail cá nhân) | Thêm email vào Test users ở Bước 2.4 |
