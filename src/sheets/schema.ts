// Cấu trúc Google Sheet — nguồn duy nhất cho cả code đọc dữ liệu và file mẫu (scripts/make-template.ts).
// Tên tab/cột so khớp không phân biệt hoa thường và dấu, nhưng nên giữ đúng như dưới đây.
// File này không import gì để script Node chạy trực tiếp được.

export const LEAD_STATUS = ['Data mới', 'Đã kết nối', 'Tư vấn', 'Hot lead', 'Đăng ký', 'Hủy'] as const
export const STUDENT_STATUS = ['Chờ xếp lớp', 'Đang học', 'Bảo lưu', 'Hoàn thành', 'Nghỉ'] as const
export const CLASS_STATUS = ['Sắp KG', 'Đang học', 'Kết thúc'] as const
export const TX_TYPES = ['Thu học phí', 'Hoàn tiền', 'Điều chỉnh'] as const
export const TASK_STATUS = ['Chưa làm', 'Đang làm', 'Hoàn thành'] as const
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'] as const
export const DEPARTMENTS = ['Sale', 'Vận hành', 'Đào tạo', 'Kế toán', 'CEO'] as const
export const SOURCES = ['Facebook', 'Free Class', 'Website', 'Referral', 'Data cũ'] as const
export const PAYMENT_METHODS = ['Chuyển khoản', 'Tiền mặt'] as const
export const YES_NO = ['Có', 'Không'] as const

export type ColumnKind = 'text' | 'number' | 'date' | 'datetime'

export interface ColumnDef {
  header: string
  kind: ColumnKind
  required?: boolean
  options?: readonly string[]
  note?: string
}

export interface TabDef {
  sheet: string
  description: string
  optional?: boolean
  cols: Record<string, ColumnDef>
}

const col = <K extends ColumnKind>(header: string, kind: K, extra: Omit<Partial<ColumnDef>, 'kind'> = {}) => ({ header, ...extra, kind })

export const TABS = {
  lead: {
    sheet: 'Lead',
    description: 'Mỗi dòng là 1 data/lead. Lead chốt thành công → đổi Trạng thái = Đăng ký và thêm dòng ở tab HocVien.',
    cols: {
      code: col('Mã lead', 'text'),
      name: col('Họ tên', 'text'),
      phone: col('SĐT', 'text'),
      source: col('Nguồn', 'text', { options: SOURCES }),
      sale: col('Sale', 'text'),
      course: col('Khóa quan tâm', 'text'),
      status: col('Trạng thái', 'text', { required: true, options: LEAD_STATUS }),
      createdAt: col('Ngày vào', 'date', { required: true }),
      followUp: col('Ngày follow-up', 'date', { required: true }),
      value: col('Giá trị dự kiến', 'number'),
    },
  },
  student: {
    sheet: 'HocVien',
    description: 'Mỗi dòng là 1 học viên đã đăng ký.',
    cols: {
      code: col('Mã HV', 'text', { required: true }),
      leadCode: col('Mã lead', 'text'),
      name: col('Họ tên', 'text'),
      phone: col('SĐT', 'text'),
      sale: col('Sale', 'text'),
      status: col('Trạng thái', 'text', { required: true, options: STUDENT_STATUS }),
      createdAt: col('Ngày tạo', 'date', { required: true }),
      attendance: col('Chuyên cần (%)', 'number', { required: true, note: 'Số từ 0–100' }),
      progress: col('Tiến độ (%)', 'number', { note: 'Số từ 0–100' }),
    },
  },
  enrollment: {
    sheet: 'DangKy',
    description: 'Mỗi dòng là 1 lần đăng ký khóa (1 học viên có thể đăng ký nhiều khóa).',
    cols: {
      code: col('Mã ĐK', 'text', { required: true }),
      studentCode: col('Mã HV', 'text', { required: true }),
      course: col('Khóa', 'text'),
      classCode: col('Lớp', 'text'),
      value: col('Giá trị khóa', 'number', { required: true }),
      date: col('Ngày đăng ký', 'date', { required: true }),
      due: col('Hạn thanh toán', 'date', { required: true }),
    },
  },
  transaction: {
    sheet: 'GiaoDich',
    description: 'Mỗi dòng là 1 lần thu/hoàn tiền. Số tiền luôn nhập số dương, Loại quyết định cộng hay trừ (Điều chỉnh: nhập âm để trừ).',
    cols: {
      code: col('Mã GD', 'text'),
      time: col('Thời gian', 'datetime', { required: true }),
      studentCode: col('Mã HV', 'text'),
      enrollmentCode: col('Mã ĐK', 'text', { required: true }),
      content: col('Nội dung', 'text'),
      amount: col('Số tiền', 'number', { required: true }),
      type: col('Loại', 'text', { required: true, options: TX_TYPES }),
      method: col('Phương thức', 'text', { options: PAYMENT_METHODS }),
      recordedBy: col('Người ghi nhận', 'text'),
      reconciled: col('Đã đối soát', 'text', { options: YES_NO }),
    },
  },
  class: {
    sheet: 'LopHoc',
    description: 'Mỗi dòng là 1 lớp. Cột "Cần điều phối" ghi chú vấn đề (thiếu GV/TA/phòng), để trống nếu ổn.',
    cols: {
      code: col('Mã lớp', 'text', { required: true }),
      course: col('Khóa', 'text'),
      teacher: col('Giáo viên', 'text'),
      capacity: col('Sĩ số tối đa', 'number'),
      startDate: col('Ngày KG', 'date'),
      status: col('Trạng thái', 'text', { required: true, options: CLASS_STATUS }),
      needs: col('Cần điều phối', 'text', { required: true }),
    },
  },
  task: {
    sheet: 'CongViec',
    description: 'Mỗi dòng là 1 công việc.',
    cols: {
      code: col('Mã CV', 'text'),
      title: col('Tiêu đề', 'text', { required: true }),
      note: col('Ghi chú', 'text'),
      department: col('Bộ phận', 'text', { required: true, options: DEPARTMENTS }),
      assignee: col('Người phụ trách', 'text'),
      due: col('Hạn', 'datetime', { required: true }),
      priority: col('Ưu tiên', 'text', { options: PRIORITIES }),
      status: col('Trạng thái', 'text', { required: true, options: TASK_STATUS }),
    },
  },
  log: {
    sheet: 'NhatKy',
    description: 'Nhật ký hoạt động. Dashboard hiển thị các dòng mới nhất.',
    cols: {
      time: col('Thời gian', 'datetime', { required: true }),
      targetCode: col('Mã đối tượng', 'text'),
      name: col('Tên', 'text'),
      event: col('Sự kiện', 'text', { required: true }),
      department: col('Bộ phận', 'text', { options: DEPARTMENTS }),
      actor: col('Người thực hiện', 'text'),
      result: col('Kết quả', 'text'),
    },
  },
  config: {
    sheet: 'CauHinh',
    description: 'Tham số tính toán. Không có tab này thì dùng giá trị mặc định.',
    optional: true,
    cols: {
      key: col('Tham số', 'text', { required: true }),
      value: col('Giá trị', 'number', { required: true }),
      note: col('Ghi chú', 'text'),
    },
  },
} satisfies Record<string, TabDef>

export type TabKey = keyof typeof TABS

/** Tham số trong tab CauHinh + giá trị mặc định. */
export const CONFIG_KEYS = {
  attendanceThreshold: { label: 'Ngưỡng chuyên cần (%)', default: 70, note: 'Học viên đang học có chuyên cần dưới ngưỡng → cảnh báo nguy cơ bỏ học' },
  hotLeadSlaDays: { label: 'SLA hot lead (ngày)', default: 1, note: 'Hot lead quá ngày follow-up hơn số ngày này → cảnh báo quá hạn' },
  paymentReminderDays: { label: 'Nhắc thanh toán trước (ngày)', default: 3, note: 'Đăng ký còn nợ và hạn thanh toán trong số ngày này → cảnh báo' },
} as const

export type ConfigKey = keyof typeof CONFIG_KEYS
