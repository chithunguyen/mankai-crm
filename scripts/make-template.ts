// Tạo file mẫu public/mankai-crm-template.xlsx (import vào Google Sheets).
// Chạy: npm run template   — cấu trúc lấy từ src/sheets/schema.ts, dữ liệu mẫu sinh ngẫu nhiên quanh ngày hiện tại.

import ExcelJS from 'exceljs'
import { CLASS_STATUS, CONFIG_KEYS, TABS, type ColumnDef, type TabDef } from '../src/sheets/schema.ts'

const OUT = new URL('../public/mankai-crm-template.xlsx', import.meta.url)

// ---- Sinh số ngẫu nhiên có seed để file ổn định giữa các lần chạy trong cùng ngày
let seed = 20260923
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32)
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)]
const int = (a: number, b: number) => a + Math.floor(rand() * (b - a + 1))

const now = new Date()
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
const DAY = 86400000
// Ngày ghi dưới dạng UTC để Excel/Sheets hiển thị đúng ngày, không lệch múi giờ
const day = (offset: number, h = 0, m = 0) => new Date(today.getTime() + offset * DAY + (h * 60 + m) * 60000)
const minDate = (a: Date, b: Date) => (a < b ? a : b)

const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô']
const DEM = ['Minh', 'Thu', 'Hoàng', 'Thảo', 'Quốc', 'Mai', 'Nhật', 'Thanh', 'Gia', 'Khánh']
const TEN = ['Anh', 'Long', 'Nam', 'Hà', 'Linh', 'Vy', 'Đức', 'Khoa', 'Trang', 'Huy', 'Ngọc', 'Phương']
const name = () => `${pick(HO)} ${pick(DEM)} ${pick(TEN)}`
const phone = () => `09${int(10000000, 99999999)}`
const SALES = ['Chi', 'Lan Anh', 'Minh', 'Hà']
const SOURCES = ['Facebook', 'Facebook', 'Free Class', 'Website', 'Referral', 'Data cũ']
const PRICES: Record<string, number> = { N1: 11_900_000, N2: 6_990_000, N3: 7_900_000, N4: 5_490_000, TNGĐ: 10_990_000 }
const COURSES = Object.keys(PRICES)

// ---- Lớp học
const classes = [
  ['N1-05', 'N1', 'Thùy ss', 15, day(-35), 'Đang học', ''],
  ['N2-09', 'N2', 'Giang ss', 20, day(-2), 'Đang học', ''],
  ['N3-12', 'N3', 'TA Mankai', 20, day(-11), 'Đang học', 'Thiếu TA ca tối thứ 5'],
  ['N4-03', 'N4', 'Hương ss', 18, day(-60), 'Đang học', ''],
  ['TNGĐ-02', 'TNGĐ', 'Giang ss', 12, day(-20), 'Đang học', ''],
  ['N2-10', 'N2', '', 20, day(6), 'Sắp KG', 'Chưa có giáo viên'],
  ['N1-04', 'N1', 'Thùy ss', 15, day(-200), 'Kết thúc', ''],
] as const
const classFor = (course: string) => classes.find((c) => c[1] === course && c[5] !== CLASS_STATUS[2])?.[0] ?? ''

// ---- Lead + học viên + đăng ký + giao dịch
const leads: unknown[][] = []
const students: unknown[][] = []
const enrollments: unknown[][] = []
const transactions: unknown[][] = []
let hv = 0
let dk = 0
let gd = 0

function enroll(studentCode: string, course: string, date: Date, sale: string) {
  const code = `DK-${String(++dk).padStart(4, '0')}`
  const value = PRICES[course]
  const due = new Date(date.getTime() + int(10, 30) * DAY)
  const row = [code, studentCode, course, classFor(course), value, date, due]
  enrollments.push(row)
  const r = rand()
  const pay = (amount: number, at: Date, note: string) =>
    at <= day(0, 23) &&
    transactions.push([`GD-${String(++gd).padStart(4, '0')}`, at, studentCode, code, `${note} · ${course}`, amount, 'Thu học phí', pick(['Chuyển khoản', 'Chuyển khoản', 'Tiền mặt']), pick(['Lan', 'Ngọc']), rand() < 0.85 ? 'Có' : 'Không'])
  if (r < 0.6) pay(value, new Date(date.getTime() + int(0, 3) * DAY + int(9, 17) * 3600000), 'Thanh toán đủ')
  else if (r < 0.9) {
    const first = Math.round((value * 0.5) / 100000) * 100000
    pay(first, new Date(date.getTime() + int(9, 17) * 3600000), 'Đợt 1')
    if (rand() < 0.5) pay(value - first, new Date(due.getTime() - int(0, 5) * DAY + 10 * 3600000), 'Đợt 2')
    // một phần chưa đóng đợt 2 → dời hạn về mấy ngày tới để có dữ liệu "sắp đến hạn"
    else if (rand() < 0.5 && date < day(-3)) row[6] = day(int(0, 3))
  }
  return code
}

for (let i = 1; i <= 170; i++) {
  const age = Math.floor(rand() ** 1.6 * 180) // nhiều lead gần đây hơn
  const course = pick(COURSES)
  const sale = pick(SALES)
  // lead càng cũ càng đi xa trong phễu (hoặc bị hủy)
  const r = rand()
  const status =
    age < 3 ? pick(['Data mới', 'Data mới', 'Đã kết nối'])
    : r < 0.22 ? 'Đăng ký'
    : r < 0.4 ? 'Hủy'
    : age < 20 ? pick(['Data mới', 'Đã kết nối', 'Tư vấn', 'Tư vấn', 'Hot lead'])
    : pick(['Đã kết nối', 'Tư vấn', 'Hot lead', 'Hủy'])
  const open = !['Đăng ký', 'Hủy'].includes(status)
  const followUp = open ? day(int(-4, 4)) : minDate(day(-age + int(1, 7)), day(0))
  const code = `LD-${String(i).padStart(4, '0')}`
  const person = name()
  leads.push([code, person, phone(), pick(SOURCES), sale, course, status, day(-age), followUp, PRICES[course]])

  if (status === 'Đăng ký') {
    const studentCode = `MK-${String(++hv).padStart(5, '0')}`
    const regDate = minDate(day(-age + int(2, 12)), day(0))
    const active = regDate > day(-90)
    students.push([studentCode, code, person, phone(), sale, active ? pick(['Đang học', 'Đang học', 'Đang học', 'Chờ xếp lớp']) : pick(['Hoàn thành', 'Đang học', 'Bảo lưu']), regDate, int(55, 100), int(10, 95)])
    enroll(studentCode, course, regDate, sale)
  }
}

// Học viên cũ (trước 6 tháng), một số học tiếp trong kỳ này
for (let i = 0; i < 30; i++) {
  const studentCode = `MK-${String(++hv).padStart(5, '0')}`
  const created = day(-int(190, 400))
  const course = pick(['N4', 'N3', 'N2'])
  const continuing = rand() < 0.35
  students.push([studentCode, '', name(), phone(), pick(SALES), continuing ? 'Đang học' : pick(['Hoàn thành', 'Hoàn thành', 'Nghỉ']), created, int(60, 100), continuing ? int(20, 80) : 100])
  enroll(studentCode, course, created, '')
  if (continuing) enroll(studentCode, course === 'N4' ? 'N3' : course === 'N3' ? 'N2' : 'N1', day(-int(0, 150)), '')
}

// Vài lần hoàn tiền
for (let i = 0; i < 2; i++) {
  const e = pick(enrollments)
  transactions.push([`GD-${String(++gd).padStart(4, '0')}`, day(-int(1, 40), 15), e[1], e[0], 'Hoàn tiền bảo lưu', 1_000_000, 'Hoàn tiền', 'Chuyển khoản', 'Lan', 'Có'])
}

// ---- Công việc
const tasks = [
  ['Follow-up hot lead quá hạn', 'Danh sách hot lead chưa gọi lại', 'Sale', 'Chi', day(-1, 17), 'Cao', 'Chưa làm'],
  ['Phân data Free Class', '18 data chưa có owner', 'Vận hành', 'Hương', day(0, 11), 'Trung bình', 'Đang làm'],
  ['Kiểm tra chuyên cần N1-05', '4 học viên dưới 70%', 'Đào tạo', 'Thùy ss', day(0, 16), 'Trung bình', 'Chưa làm'],
  ['Đối soát giao dịch hôm qua', 'Đối chiếu sao kê ngân hàng', 'Kế toán', 'Lan', day(0, 10), 'Cao', 'Chưa làm'],
  ['Gọi xác nhận lịch học N2-09', '', 'Sale', 'Lan Anh', day(0, 18), 'Thấp', 'Chưa làm'],
  ['Gửi lịch khai giảng N2-10', 'Tự động trước KG 1 ngày', 'Vận hành', 'Hương', day(5, 9), 'Trung bình', 'Chưa làm'],
  ['Tìm giáo viên lớp N2-10', '', 'Đào tạo', 'Giang ss', day(2, 12), 'Cao', 'Đang làm'],
  ['Nhắc đóng học phí đợt 2', 'Các học viên sắp đến hạn', 'Kế toán', 'Ngọc', day(1, 9), 'Trung bình', 'Chưa làm'],
  ['Báo cáo doanh thu tuần', '', 'CEO', 'Chi', day(3, 17), 'Thấp', 'Chưa làm'],
  ['Cập nhật điểm test N3-12', '', 'Đào tạo', 'TA Mankai', day(-2, 17), 'Trung bình', 'Hoàn thành'],
  ['Import data hội thảo', '', 'Vận hành', 'Hương', day(-1, 10), 'Trung bình', 'Hoàn thành'],
].map((t, i) => [`CV-${String(i + 1).padStart(3, '0')}`, ...t])

// ---- Nhật ký
const EVENTS: [string, string, string, string][] = [
  ['Chuyển → Đăng ký', 'Sale', 'Chi', 'Thành công'],
  ['Thu học phí', 'Kế toán', 'Lan', 'Đã ghi nhận'],
  ['Xếp lớp', 'Vận hành', 'Hương', 'Đã xếp'],
  ['Hot lead → follow-up', 'Sale', 'Lan Anh', 'Đang xử lý'],
  ['Cập nhật chuyên cần', 'Đào tạo', 'Thùy ss', 'Hoàn thành'],
  ['Gửi nhắc thanh toán', 'Kế toán', 'Ngọc', 'Thành công'],
]
const logs = Array.from({ length: 20 }, () => {
  const s = pick(students)
  const [event, dept, actor, result] = pick(EVENTS)
  return [day(-int(0, 3), int(8, 20), int(0, 59)), s[0], s[2], event, dept, actor, result]
}).sort((a, b) => (b[0] as Date).getTime() - (a[0] as Date).getTime())

const config = Object.values(CONFIG_KEYS).map((c) => [c.label, c.default, c.note])

const DATA: Record<keyof typeof TABS, unknown[][]> = {
  lead: leads,
  student: students,
  enrollment: enrollments,
  transaction: transactions,
  class: classes.map((c) => [...c]),
  task: tasks,
  log: logs,
  config,
}

// ---- Ghi file
const wb = new ExcelJS.Workbook()
wb.creator = 'Mankai CRM'

const guide = wb.addWorksheet('HuongDan')
guide.columns = [{ width: 16 }, { width: 110 }]
guide.addRow(['Mankai CRM — file dữ liệu cho Dashboard']).font = { bold: true, size: 14 }
guide.addRow(['Dòng 1 mỗi tab là tiêu đề. Cột tiêu đề nền cam đậm là BẮT BUỘC: không đổi tên hoặc xoá. Có thể thêm cột khác, đổi thứ tự cột.'])
guide.addRow(['Ngày nhập dạng dd/mm/yyyy, số tiền nhập số (không cần dấu chấm). Cột có dropdown chỉ chọn giá trị trong danh sách.'])
guide.addRow(['Tab HuongDan này có thể xoá.'])
guide.addRow([])
for (const tab of Object.values(TABS) as TabDef[]) {
  guide.addRow([tab.sheet, tab.description]).getCell(1).font = { bold: true }
}

for (const [key, tab] of Object.entries(TABS) as [keyof typeof TABS, TabDef][]) {
  const ws = wb.addWorksheet(tab.sheet, { views: [{ state: 'frozen', ySplit: 1 }] })
  const cols = Object.values(tab.cols) as ColumnDef[]
  ws.columns = cols.map((c) => ({
    header: c.header,
    width: Math.max(12, c.header.length + 4, c.kind === 'datetime' ? 18 : 0, c.kind === 'text' && /Tiêu đề|Sự kiện|Nội dung|Ghi chú|Cần điều phối/.test(c.header) ? 30 : 0),
    style:
      c.kind === 'date' ? { numFmt: 'dd/mm/yyyy' }
      : c.kind === 'datetime' ? { numFmt: 'dd/mm/yyyy hh:mm' }
      : c.kind === 'number' && !/%|ngày/i.test(c.header) ? { numFmt: '#,##0' }
      : {},
  }))
  const header = ws.getRow(1)
  header.font = { bold: true, color: { argb: 'FF7C2D12' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEDD5' } }
  cols.forEach((c, i) => {
    const cell = header.getCell(i + 1)
    if (c.required) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDBA74' } }
      cell.note = 'Cột bắt buộc — dashboard dùng cột này, không đổi tên/xoá.'
    }
    if (c.options) {
      const letter = ws.getColumn(i + 1).letter
      ws.dataValidations.add(`${letter}2:${letter}2000`, {
        type: 'list',
        allowBlank: true,
        formulae: [`"${c.options.join(',')}"`],
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: `Chọn một trong: ${c.options.join(', ')}`,
      })
    }
  })
  ws.addRows(DATA[key])
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } }
}

await wb.xlsx.writeFile(OUT.pathname)
console.log(`Đã tạo ${OUT.pathname}: ${leads.length} lead, ${students.length} học viên, ${enrollments.length} đăng ký, ${transactions.length} giao dịch`)
