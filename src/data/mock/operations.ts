import type { ClassRoom, FunnelRow, Kpi, OpsCard, ScheduleItem, Task } from '../../types'

export const taskKpis: Kpi[] = [
  { label: 'Tổng task hôm nay', value: '57' },
  { label: 'Đã hoàn thành', value: '31', meta: '54.4%', metaClass: 'up' },
  { label: 'Quá hạn', value: '9', valueClass: 'danger' },
  { label: 'Tự động tạo', value: '38' },
]

export const tasks: Task[] = [
  { id: 't1', title: 'Follow-up Phạm Hoàng Long', note: 'Sale · Hot lead · hạn 17:00', tag: { label: 'Quá hạn', tone: 'red' } },
  { id: 't2', title: 'Phân 18 data Free Class', note: 'Vận hành · 18 data chưa có owner', tag: { label: 'Hôm nay', tone: 'orange' } },
  { id: 't3', title: 'Kiểm tra attendance N1-05', note: 'Đào tạo · 4 học viên < 70%', tag: { label: 'Đào tạo', tone: 'blue' } },
  { id: 't4', title: 'Đối soát giao dịch 23/09', note: 'Kế toán · 18 giao dịch', tag: { label: 'Kế toán', tone: 'green' } },
  { id: 't5', title: 'Gửi lịch khai giảng N2-09', note: 'Vận hành · tự động trước KG 1 ngày', tag: { label: 'Tự động', tone: 'gray' } },
]

export const checklist: Task[] = [
  { id: 'c1', title: '08:00 · Rà soát nguồn data Sale', note: 'Kiểm tra data mới, data tồn, chất lượng số điện thoại/Zalo và phân nhóm trước khi giao', tag: { label: 'Hàng ngày', tone: 'orange' } },
  { id: 'c2', title: '09:00 · Kiểm tra lead nóng', note: 'Rà soát SLA, lead có tín hiệu mua, lead chưa được follow và thực hiện đảo lead nếu cần', tag: { label: 'Ưu tiên', tone: 'red' } },
  { id: 'c3', title: '14:00 · Kiểm tra học viên chờ xếp lớp', note: 'Đối chiếu thanh toán, lịch khai giảng, sĩ số và điều kiện vào lớp', tag: { label: 'Vận hành', tone: 'blue' } },
  { id: 'c4', title: '17:30 · Tổng hợp cảnh báo liên phòng ban', note: 'Chuyển case sang Sale / Đào tạo / Kế toán và ghi nhận owner', tag: { label: 'Hàng ngày', tone: 'green' } },
]

export const classes: ClassRoom[] = [
  { code: 'N2-09', teacher: 'Giang ss', enrolled: 18, capacity: 20, startDate: '25/09', progress: 72, status: { label: 'Đang học', tone: 'green' }, extra: { label: '94% attendance', tone: 'gray' } },
  { code: 'N1-05', teacher: 'Thùy ss', enrolled: 12, capacity: 15, startDate: '18/09', progress: 84, status: { label: 'Đang học', tone: 'green' }, extra: { label: '4 cần CS', tone: 'orange' } },
  { code: 'N3-12', teacher: 'TA Mankai', enrolled: 20, capacity: 20, startDate: '12/09', progress: 66, status: { label: 'Đang học', tone: 'green' }, extra: { label: '96% attendance', tone: 'blue' } },
]

export const schedule: ScheduleItem[] = [
  { time: '18:30–20:00', detail: 'N2-09 · Giang ss · Phòng 02', status: { label: 'Đủ GV', tone: 'green' } },
  { time: '19:00–20:30', detail: 'N1-05 · Thùy ss · Zoom', status: { label: 'Đủ GV', tone: 'green' } },
  { time: '20:00–21:30', detail: 'N3-12 · TA Mankai · Phòng 01', status: { label: 'Thiếu TA', tone: 'orange' } },
]

export const classCapacity: FunnelRow[] = [
  { label: 'N2', value: '18/20', percent: 90 },
  { label: 'N1', value: '12/15', percent: 80 },
  { label: 'N3', value: '20/20', percent: 100 },
]

export const resultKpis: Kpi[] = [
  { label: 'Điểm test TB', value: '108/180', meta: '↑ 6 điểm / 4 tuần', metaClass: 'up' },
  { label: 'Học viên sắp thi', value: '326', meta: 'Kỳ JLPT tháng 12' },
  { label: 'Cần luyện đề', value: '84', meta: 'Điểm hiện tại dưới mục tiêu', metaClass: 'warn' },
  { label: 'Có cơ hội học tiếp', value: '142', meta: 'Đưa sang Sale chăm sóc', metaClass: 'blue' },
]

export const opsCards: OpsCard[] = [
  { title: 'Phân data', note: '234 data mới · 18 chưa có owner', action: 'Xử lý', toast: 'Đã mở màn hình phân data' },
  { title: 'Đảo lead nóng', note: '7 lead cần điều phối trong hôm nay', action: 'Xử lý', toast: 'Đã mở danh sách lead nóng' },
  { title: 'Xếp lớp', note: '12 học viên chờ xếp lớp', action: 'Xem lớp', to: '/classes' },
  { title: 'Khai giảng', note: '4 lớp trong 7 ngày tới', action: 'Xem lịch', toast: 'Đã mở lịch khai giảng' },
  { title: 'Thiếu nhân sự', note: '5 ca cần GV/TA', action: 'Điều phối', toast: 'Đã tạo checklist điều phối' },
  { title: 'Học viên chưa vào lớp', note: '8 HV đã thu tiền nhưng chưa xếp lớp', action: 'Xử lý', toast: 'Đã mở danh sách 8 học viên' },
  { title: 'Follow-up lỗi SLA', note: '32 hot lead chưa được xử lý đúng hạn', action: 'Xem data', to: '/data' },
  { title: 'Đối soát', note: '18 giao dịch chờ xác nhận', action: 'Xem giao dịch', to: '/transactions' },
]
