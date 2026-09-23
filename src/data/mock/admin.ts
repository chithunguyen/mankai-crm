import type { AuditLog, AutomationSetting, JourneyRule, RoleDef } from '../../types'

export const roles: RoleDef[] = [
  { name: 'CEO', badge: { label: 'Toàn quyền', tone: 'red' }, permissions: ['Xem toàn bộ hệ thống', 'Quản trị dữ liệu & báo cáo', 'Quản lý người dùng', 'Xem Audit log'] },
  { name: 'Vận hành', badge: { label: 'Điều phối', tone: 'orange' }, permissions: ['Phân & đảo data', 'Điều phối lớp', 'Xem toàn bộ lead', 'Không xem tài chính chi tiết'] },
  { name: 'Sale', badge: { label: 'Theo owner', tone: 'blue' }, permissions: ['Data được giao', 'Học viên phụ trách', 'Tạo task/follow-up', 'Xem trạng thái thanh toán'] },
  { name: 'Đào tạo', badge: { label: 'Học tập', tone: 'green' }, permissions: ['Học viên đã đăng ký', 'Lớp & lịch học', 'Attendance/bài tập', 'Điểm & tiến độ'] },
  { name: 'Kế toán', badge: { label: 'Tài chính', tone: 'gray' }, permissions: ['Học phí & công nợ', 'Giao dịch', 'Đối soát', 'Không xem nội dung tư vấn'] },
]

export const auditLogs: AuditLog[] = [
  { time: '09:32:11', user: 'Chi', department: 'Sale', action: 'Chuyển trạng thái → Đã đăng ký', target: 'MK-2026-01842', origin: 'Web' },
  { time: '09:35:20', user: 'Lan', department: 'Kế toán', action: 'Cập nhật thanh toán 3M', target: 'MK-2026-01842', origin: 'Web' },
  { time: '10:15:42', user: 'Hương', department: 'Vận hành', action: 'Xếp lớp N2-09', target: 'MK-2026-01842', origin: 'Web' },
  { time: '10:26:03', user: 'Chi', department: 'Sale', action: 'Tạo task follow-up', target: 'MK-2026-01921', origin: 'Web' },
]

export const automations: AutomationSetting[] = [
  { id: 'hot-lead-sla', title: 'Nhắc hot lead quá SLA', note: 'Tạo task sau 24h chưa follow', enabled: true },
  { id: 'low-attendance', title: 'Cảnh báo attendance thấp', note: 'Khi <70% trong 2 tuần', enabled: true },
  { id: 'payment-reminder', title: 'Nhắc thanh toán', note: 'Trước hạn 3 ngày', enabled: true },
  { id: 'upsell', title: 'Cơ hội học tiếp', note: 'Tạo opportunity khi gần hoàn thành', enabled: false },
]

export const journeyRules: JourneyRule[] = [
  { title: 'Data mới → Kết nối', note: 'Có Zalo + phản hồi tin nhắn', badge: { label: 'Tự động', tone: 'blue' } },
  { title: 'Kết nối → Hot', note: 'Theo tiêu chí Sale xác nhận', badge: { label: 'Sale', tone: 'orange' } },
  { title: 'Đăng ký → Đang học', note: 'Sau khi thanh toán + xếp lớp', badge: { label: 'Hệ thống', tone: 'green' } },
  { title: 'Đang học → Kết quả', note: 'Sau khi hoàn thành khóa/test', badge: { label: 'Đào tạo', tone: 'green' } },
]
