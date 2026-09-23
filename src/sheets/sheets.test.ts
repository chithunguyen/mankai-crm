import { describe, expect, it } from 'vitest'
import { computeDashboard, formatShort } from './compute'
import { parseSheet, serialToDate, toDate, toNumber, type Cell } from './parse'
import { TABS } from './schema'

const headers = (key: keyof typeof TABS) => Object.values(TABS[key].cols).map((c) => c.header)

// "Hôm nay" cố định: 23/09/2026 10:00
const NOW = new Date(2026, 8, 23, 10, 0)

const fixture: Record<string, Cell[][]> = {
  Lead: [
    headers('lead'),
    ['L1', 'A', '', 'Facebook', 'Chi', 'N2', 'Data mới', '20/09/2026', '25/09/2026', 7000000],
    ['L2', 'B', '', 'Facebook', 'Chi', 'N2', 'Tư vấn', '19/09/2026', '24/09/2026', 7000000],
    ['L3', 'C', '', 'Website', 'Chi', 'N1', 'Hot lead', '10/09/2026', '20/09/2026', 7000000], // quá follow-up 3 ngày > SLA 1
    ['L4', 'D', '', 'Website', 'Chi', 'N1', 'hot LEAD', '15/09/2026', '22/09/2026', 7000000], // quá 1 ngày = SLA → chưa cảnh báo
    ['L5', 'E', '', 'Referral', 'Chi', 'N1', 'Đăng ký', '01/09/2026', '05/09/2026', 7000000],
    ['L6', 'F', '', 'Referral', 'Chi', 'N1', 'Hủy', '01/09/2026', '05/09/2026', 7000000],
    [],
  ],
  HocVien: [
    headers('student'),
    ['HV1', 'L5', 'E', '', 'Chi', 'Đang học', '05/09/2026', 94, 70],
    ['HV2', '', 'G', '', 'Chi', 'Đang học', '10/08/2026', 60, 40], // chuyên cần thấp
    ['HV3', '', 'H', '', 'Chi', 'Hoàn thành', '10/03/2026', 0.5, 100], // không đang học → bỏ qua
  ],
  DangKy: [
    headers('enrollment'),
    ['DK1', 'HV1', 'N1', 'N1-05', 10_000_000, '05/09/2026', '24/09/2026'], // đã thu 4M → còn nợ, sắp đến hạn
    ['DK2', 'HV2', 'N2', 'N2-09', '6.000.000', '10/08/2026', '20/08/2026'], // thu đủ
    ['DK3', 'HV3', 'N3', 'N3-01', 5_000_000, '10/03/2026', '20/09/2026'], // chưa thu → quá hạn
  ],
  GiaoDich: [
    headers('transaction'),
    ['GD1', '05/09/2026 09:00', 'HV1', 'DK1', '', 4_000_000, 'Thu học phí', 'Chuyển khoản', 'Lan', 'Có'],
    ['GD2', '11/08/2026 09:00', 'HV2', 'DK2', '', 6_500_000, 'Thu học phí', 'Chuyển khoản', 'Lan', 'Có'],
    ['GD3', '12/09/2026 09:00', 'HV2', 'DK2', '', 500_000, 'Hoàn tiền', 'Chuyển khoản', 'Lan', 'Có'],
  ],
  LopHoc: [
    headers('class'),
    ['N1-05', 'N1', 'Thùy', 15, '18/09/2026', 'Đang học', ''],
    ['N3-12', 'N3', 'TA', 20, '12/09/2026', 'Đang học', 'Thiếu TA'],
    ['N3-01', 'N3', 'TA', 20, '12/03/2026', 'Kết thúc', 'Thiếu phòng'], // đã kết thúc → bỏ qua
  ],
  CongViec: [
    headers('task'),
    ['CV1', 'Follow-up', '', 'Sale', 'Chi', '22/09/2026 17:00', 'Trung bình', 'Chưa làm'],
    ['CV2', 'Phân data', '', 'Vận hành', 'Hương', '23/09/2026 15:00', 'Trung bình', 'Đang làm'],
    ['CV3', 'Đối soát', '', 'Kế toán', 'Lan', '23/09/2026 09:00', 'Cao', 'Hoàn thành'],
    ['CV4', 'Gửi lịch', '', 'Vận hành', 'Hương', '25/09/2026 09:00', 'Thấp', 'Chưa làm'],
  ],
  NhatKy: [
    headers('log'),
    ['22/09/2026 08:00', 'HV1', 'E', 'Xếp lớp', 'Vận hành', 'Hương', 'Đã xếp'],
    ['23/09/2026 09:32', 'HV2', 'G', 'Thu tiền', 'Kế toán', 'Lan', 'Thành công'],
  ],
  CauHinh: [headers('config'), ['SLA hot lead (ngày)', 1, '']],
}

describe('parse', () => {
  it('đọc ngày dạng serial và chữ', () => {
    expect(serialToDate(46288)).toEqual(new Date(2026, 8, 23))
    expect(serialToDate(46288.5)).toEqual(new Date(2026, 8, 23, 12))
    expect(toDate('23/09/2026 09:05')).toEqual(new Date(2026, 8, 23, 9, 5))
    expect(toDate('2026-09-23')).toEqual(new Date(2026, 8, 23))
    expect(toDate('31/02/2026')).toBeNull()
    expect(toDate('')).toBeNull()
  })

  it('đọc số kiểu Việt Nam', () => {
    expect(toNumber('6.990.000')).toBe(6990000)
    expect(toNumber('6,990,000 đ')).toBe(6990000)
    expect(toNumber('94%')).toBe(94)
    expect(toNumber('12,5')).toBe(12.5)
    expect(toNumber('abc')).toBeNull()
  })

  it('báo thiếu tab và thiếu cột', () => {
    const { problems } = parseSheet({ Lead: [['Mã lead', 'Trạng thái']] })
    expect(problems).toContain('Tab "Lead" thiếu cột: "Ngày vào", "Ngày follow-up"')
    expect(problems).toContain('Thiếu tab "HocVien"')
    expect(problems.some((p) => p.includes('CauHinh'))).toBe(false) // tab tùy chọn
  })

  it('khớp tên tab/cột không phân biệt hoa thường và dấu', () => {
    const { problems } = parseSheet(Object.fromEntries(Object.entries(fixture).map(([k, v]) => [k.toLowerCase(), v])))
    expect(problems).toEqual([])
  })
})

describe('computeDashboard', () => {
  const { db, problems } = parseSheet(fixture)
  const d = computeDashboard(db, NOW)
  const kpi = (label: string) => d.kpis.find((k) => k.label === label)!

  it('không có lỗi cấu trúc', () => expect(problems).toEqual([]))

  it('KPI học viên', () => {
    expect(kpi('Tổng học viên').value).toBe('3')
    expect(kpi('Tổng học viên').meta).toBe('↑ 50.0% · so với tháng trước') // 2 → 3
    expect(kpi('Đang học').value).toBe('2')
    expect(kpi('Đang học').meta).toBe('1 học viên mới tháng này')
  })

  it('doanh thu = giá trị đăng ký trong tháng, thực thu trừ hoàn tiền', () => {
    expect(kpi('Doanh thu tháng').value).toBe('10M')
    // tháng 8: 6M → tháng 9: 10M; thực thu tháng 9 = 4M - 0.5M
    expect(kpi('Doanh thu tháng').meta).toBe('↑ 66.7% · thu thực tế 3.5M')
  })

  it('phễu tính số lead đã đi tới từng bước', () => {
    expect(kpi('Data trong phễu').value).toBe('4')
    expect(kpi('Data trong phễu').meta).toBe('1 đang tư vấn · 2 hot')
    expect(d.funnel.map((f) => f.value)).toEqual(['6', '4', '4', '3', '1'])
    expect(d.funnel[0].percent).toBe(100)
  })

  it('công việc đến hạn hôm nay và nhãn', () => {
    expect(kpi('Cần xử lý hôm nay').value).toBe('2')
    expect(d.tasks.map((t) => [t.id, t.tag.label])).toEqual([
      ['CV1', 'Quá hạn'],
      ['CV2', 'Hôm nay'],
      ['CV4', 'Vận hành'],
    ])
  })

  it('cảnh báo', () => {
    const alert = (title: string) => d.alerts.find((a) => a.title === title)!
    expect(alert('Nguy cơ bỏ học').count).toBe(1)
    expect(alert('Hot lead quá hạn').count).toBe(1)
    expect(alert('Thanh toán sắp đến hạn').count).toBe(1)
    expect(alert('Thanh toán sắp đến hạn').note).toContain('1 đã quá hạn')
    expect(alert('Lớp cần điều phối').count).toBe(1)
    expect(alert('Lớp cần điều phối').note).toBe('N3-12: Thiếu TA')
  })

  it('biểu đồ 6 tháng và hoạt động mới nhất', () => {
    expect(d.revenue.map((r) => r.month)).toEqual(['T4', 'T5', 'T6', 'T7', 'T8', 'T9'])
    expect(d.revenue.map((r) => r.value)).toEqual(['0', '0', '0', '0', '6M', '10M'])
    expect(d.revenue[5].percent).toBe(90)
    expect(d.activities.map((a) => a.time)).toEqual(['09:32', '22/09 08:00'])
    expect(d.activities[0].status).toEqual({ label: 'Thành công', tone: 'green' })
  })

  it('formatShort', () => {
    expect(formatShort(1_840_000_000)).toBe('1.84B')
    expect(formatShort(628_000_000)).toBe('628M')
    expect(formatShort(6_990_000)).toBe('6.99M')
    expect(formatShort(12_500_000)).toBe('12.5M')
  })
})
