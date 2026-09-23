// Cấu hình các form nhập liệu. Thêm/sửa field ở đây, không cần đụng component.

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'select' | 'date' | 'datetime-local' | 'number' | 'email'
  placeholder?: string
  options?: string[]
}

export interface FormDef {
  title: string
  submitLabel: string
  successMessage: string
  fields: FieldDef[]
}

const SALES = ['Chi', 'Lan Anh']
const SOURCES = ['Facebook', 'Free Class', 'Website', 'Referral']
const COURSES = ['N1', 'N2', 'N3', 'TNGĐ']

export const forms = {
  student: {
    title: 'Thêm học viên',
    submitLabel: 'Tạo học viên',
    successMessage: 'Đã tạo học viên demo',
    fields: [
      { name: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A' },
      { name: 'phone', label: 'Số điện thoại', placeholder: '09xxxxxxxx' },
      { name: 'source', label: 'Nguồn data', type: 'select', options: SOURCES },
      { name: 'sale', label: 'Sale phụ trách', type: 'select', options: SALES },
      { name: 'course', label: 'Khóa quan tâm', type: 'select', options: COURSES },
      { name: 'status', label: 'Trạng thái', type: 'select', options: ['Data mới', 'Đã kết nối', 'Tư vấn'] },
    ],
  },
  lead: {
    title: 'Tạo cơ hội / nhập data',
    submitLabel: 'Lưu data',
    successMessage: 'Đã tạo lead demo',
    fields: [
      { name: 'name', label: 'Họ và tên', placeholder: 'Tên lead' },
      { name: 'phone', label: 'SĐT / Zalo', placeholder: '09xxxxxxxx' },
      { name: 'source', label: 'Nguồn', type: 'select', options: [...SOURCES, 'Data cũ'] },
      { name: 'owner', label: 'Owner', type: 'select', options: [...SALES, 'Chưa phân'] },
      { name: 'course', label: 'Khóa quan tâm', type: 'select', options: COURSES },
      { name: 'followUp', label: 'Ngày follow-up', type: 'date' },
    ],
  },
  task: {
    title: 'Tạo công việc',
    submitLabel: 'Tạo task',
    successMessage: 'Đã tạo công việc demo',
    fields: [
      { name: 'title', label: 'Tên công việc', placeholder: 'Follow-up học viên...' },
      { name: 'assignee', label: 'Người phụ trách', type: 'select', options: ['Chi', 'Lan Anh', 'Hương', 'Thùy ss', 'Lan'] },
      { name: 'due', label: 'Hạn xử lý', type: 'datetime-local' },
      { name: 'priority', label: 'Độ ưu tiên', type: 'select', options: ['Cao', 'Trung bình', 'Thấp'] },
    ],
  },
  payment: {
    title: 'Ghi nhận thanh toán',
    submitLabel: 'Lưu giao dịch',
    successMessage: 'Đã ghi nhận giao dịch demo',
    fields: [
      { name: 'student', label: 'Học viên', placeholder: 'Nguyễn Minh Anh' },
      { name: 'amount', label: 'Số tiền', placeholder: '3.000.000' },
      { name: 'type', label: 'Loại', type: 'select', options: ['Thu học phí', 'Hoàn tiền', 'Điều chỉnh'] },
      { name: 'method', label: 'Phương thức', type: 'select', options: ['Chuyển khoản', 'Tiền mặt'] },
    ],
  },
  class: {
    title: 'Tạo lớp học',
    submitLabel: 'Tạo lớp',
    successMessage: 'Đã tạo lớp demo',
    fields: [
      { name: 'code', label: 'Tên lớp', placeholder: 'N2-10' },
      { name: 'course', label: 'Khóa', type: 'select', options: ['N1', 'N2', 'N3'] },
      { name: 'teacher', label: 'Giáo viên', placeholder: 'Tên giáo viên' },
      { name: 'capacity', label: 'Sĩ số tối đa', type: 'number', placeholder: '20' },
      { name: 'startDate', label: 'Ngày khai giảng', type: 'date' },
      { name: 'mode', label: 'Hình thức', type: 'select', options: ['Online', 'Offline', 'Hybrid'] },
    ],
  },
  result: {
    title: 'Nhập kết quả học tập',
    submitLabel: 'Lưu kết quả',
    successMessage: 'Đã lưu kết quả demo',
    fields: [
      { name: 'student', label: 'Học viên', placeholder: 'Tên học viên' },
      { name: 'type', label: 'Loại kết quả', type: 'select', options: ['Test định kỳ', 'JLPT', 'BJT', 'Khác'] },
      { name: 'score', label: 'Điểm', placeholder: '112/180' },
      { name: 'date', label: 'Ngày', type: 'date' },
    ],
  },
  account: {
    title: 'Tạo tài khoản nội bộ',
    submitLabel: 'Tạo tài khoản',
    successMessage: 'Đã tạo tài khoản demo',
    fields: [
      { name: 'name', label: 'Họ tên', placeholder: 'Nhân sự Mankai' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'name@mankai.edu.vn' },
      { name: 'department', label: 'Bộ phận', type: 'select', options: ['CEO', 'Vận hành', 'Sale', 'Đào tạo', 'Kế toán'] },
      { name: 'role', label: 'Vai trò', type: 'select', options: ['Member', 'Leader', 'Admin'] },
    ],
  },
} satisfies Record<string, FormDef>

export type FormId = keyof typeof forms
