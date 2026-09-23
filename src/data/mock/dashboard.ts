import type { Dashboard } from '../../types'

export const dashboard: Dashboard = {
  kpis: [
    { label: 'Tổng học viên', value: '2,184', icon: '◎', meta: '↑ 12.4% · so với tháng trước', metaClass: 'up' },
    { label: 'Đang học', value: '846', icon: '◒', meta: '↑ 7.8% · 38 học viên mới', metaClass: 'up' },
    { label: 'Doanh thu tháng', value: '1.84B', icon: '₫', meta: '↑ 16.2% · thu thực tế 1.62B', metaClass: 'up' },
    { label: 'Data trong phễu', value: '1,286', icon: '◫', meta: '324 đang tư vấn · 128 hot', metaClass: 'blue' },
    { label: 'Cần xử lý hôm nay', value: '57', icon: '!', meta: '32 follow-up · 25 vận hành', metaClass: 'warn' },
  ],
  revenue: [
    { month: 'T4', value: '1.12B', percent: 54 },
    { month: 'T5', value: '1.27B', percent: 61 },
    { month: 'T6', value: '1.39B', percent: 68 },
    { month: 'T7', value: '1.58B', percent: 76 },
    { month: 'T8', value: '1.34B', percent: 64 },
    { month: 'T9', value: '1.84B', percent: 89 },
  ],
  funnel: [
    { label: 'Data mới', value: '1,286', percent: 100 },
    { label: 'Đã kết nối', value: '938', percent: 73 },
    { label: 'Tư vấn', value: '628', percent: 49 },
    { label: 'Hot lead', value: '318', percent: 25 },
    { label: 'Đăng ký', value: '168', percent: 13 },
  ],
  tasks: [
    { id: 'd1', title: 'Follow-up 32 hot lead quá hạn', note: 'Sale · hạn trước 17:00', tag: { label: 'Ưu tiên', tone: 'red' } },
    { id: 'd2', title: 'Xử lý 18 data chưa phân', note: 'Vận hành · nguồn Free Class', tag: { label: 'Hôm nay', tone: 'orange' } },
    { id: 'd3', title: 'Kiểm tra 12 học viên attendance < 70%', note: 'Đào tạo · cần cảnh báo', tag: { label: 'Đào tạo', tone: 'blue' } },
    { id: 'd4', title: 'Đối soát 18 giao dịch', note: 'Kế toán · ca sáng', tag: { label: 'Kế toán', tone: 'green' } },
  ],
  alerts: [
    { count: 12, tone: 'red', title: 'Nguy cơ bỏ học', note: 'Attendance thấp hoặc không hoạt động LMS' },
    { count: 32, tone: 'orange', title: 'Hot lead quá hạn', note: 'Chưa có hoạt động follow-up theo SLA' },
    { count: 8, tone: 'blue', title: 'Thanh toán sắp đến hạn', note: 'Cần phối hợp Sale + Kế toán' },
    { count: 5, tone: 'gray', title: 'Lớp cần điều phối', note: 'Thiếu giáo viên / TA / phòng học' },
  ],
  activities: [
    { time: '09:32', student: 'Nguyễn Minh Anh', event: 'Chuyển → Đã đăng ký N2', department: 'Sale', actor: 'Chi', status: { label: 'Thành công', tone: 'green' } },
    { time: '09:18', student: 'Trần Nhật Nam', event: 'Thu 3.000.000đ', department: 'Kế toán', actor: 'Lan', status: { label: 'Đã ghi nhận', tone: 'green' } },
    { time: '08:55', student: 'Lê Thu Hà', event: 'Xếp lớp N1-09', department: 'Vận hành', actor: 'Hương', status: { label: 'Đã xếp', tone: 'blue' } },
    { time: '08:41', student: 'Phạm Hoàng Long', event: 'Hot lead → follow-up', department: 'Sale', actor: 'Chi', status: { label: 'Đang xử lý', tone: 'orange' } },
  ],
}
