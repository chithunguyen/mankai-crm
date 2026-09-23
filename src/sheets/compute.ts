// Tính toàn bộ số liệu Dashboard từ dữ liệu thô trong Google Sheet.
// Công thức được mô tả trong docs/HUONG-DAN-GOOGLE-SHEET.md — sửa ở đây thì cập nhật cả tài liệu.

import type { Activity, Alert, Dashboard, FunnelRow, Kpi, Task, Tone } from '../types'
import { normalize } from '../utils/format'
import { is, type SheetDB, type TransactionRow } from './parse'
import { LEAD_STATUS } from './schema'

const DAY = 86400000
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d: Date, offset = 0) => new Date(d.getFullYear(), d.getMonth() + offset, 1)
const inRange = (d: Date | null, from: Date, to: Date): d is Date => !!d && d >= from && d < to
const pad = (n: number) => String(n).padStart(2, '0')
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

export const formatCount = (n: number) => n.toLocaleString('en-US')

/** 1840000000 → "1.84B", 628000000 → "628M", 6990000 → "6.99M" */
export function formatShort(n: number): string {
  const abs = Math.abs(n)
  const [div, unit] = abs >= 1e9 ? [1e9, 'B'] : abs >= 1e6 ? [1e6, 'M'] : abs >= 1e3 ? [1e3, 'K'] : [1, '']
  const v = n / div
  const digits = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2
  return `${Number(v.toFixed(digits))}${unit}`
}

const pctChange = (cur: number, prev: number) => (prev > 0 ? ((cur - prev) / prev) * 100 : null)

function changeMeta(change: number | null, suffix: string): Pick<Kpi, 'meta' | 'metaClass'> {
  if (change == null) return { meta: suffix }
  const arrow = change >= 0 ? '↑' : '↓'
  return { meta: `${arrow} ${Math.abs(change).toFixed(1)}% · ${suffix}`, metaClass: change >= 0 ? 'up' : 'danger' }
}

/** Số tiền có dấu: Hoàn tiền luôn trừ, Điều chỉnh giữ dấu như nhập, còn lại luôn cộng. */
export function signedAmount(t: TransactionRow): number {
  const a = t.amount ?? 0
  if (is(t.type, 'Hoàn tiền')) return -Math.abs(a)
  if (is(t.type, 'Điều chỉnh')) return a
  return Math.abs(a)
}

const DEPT_TONE: Record<string, Tone> = { sale: 'orange', 'van hanh': 'orange', 'dao tao': 'blue', 'ke toan': 'green' }

function resultTone(result: string): Tone {
  const r = normalize(result)
  if (/loi|that bai|huy/.test(r)) return 'red'
  if (/dang xu ly|cho/.test(r)) return 'orange'
  if (/xep|chuyen/.test(r)) return 'blue'
  if (/thanh cong|da ghi nhan|hoan thanh|xong/.test(r)) return 'green'
  return 'gray'
}

function formatTime(d: Date, today: Date) {
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return startOfDay(d).getTime() === today.getTime() ? hm : `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${hm}`
}

export function computeDashboard(db: SheetDB, now: Date): Dashboard {
  const today = startOfDay(now)
  const tomorrow = new Date(today.getTime() + DAY)
  const monthStart = startOfMonth(now)
  const nextMonthStart = startOfMonth(now, 1)
  const prevMonthStart = startOfMonth(now, -1)
  const { config } = db

  // ---- Học viên
  const totalStudents = db.students.length
  const studentsBeforeMonth = db.students.filter((s) => !s.createdAt || s.createdAt < monthStart).length
  const active = db.students.filter((s) => is(s.status, 'Đang học'))
  const newActive = active.filter((s) => inRange(s.createdAt, monthStart, nextMonthStart)).length

  // ---- Doanh thu (giá trị đăng ký) và thực thu
  const revenueIn = (from: Date, to: Date) => sum(db.enrollments.filter((e) => inRange(e.date, from, to)).map((e) => e.value ?? 0))
  const revenueMonth = revenueIn(monthStart, nextMonthStart)
  const revenuePrev = revenueIn(prevMonthStart, monthStart)
  const collectedMonth = sum(db.transactions.filter((t) => inRange(t.time, monthStart, nextMonthStart)).map(signedAmount))

  // ---- Phễu
  const stageOf = (status: string) => LEAD_STATUS.findIndex((s) => is(status, s))
  const openLeads = db.leads.filter((l) => !is(l.status, 'Đăng ký') && !is(l.status, 'Hủy'))
  const funnelStages = LEAD_STATUS.slice(0, 5) // Data mới → Đăng ký
  const reached = funnelStages.map((_, k) => (k === 0 ? db.leads.length : db.leads.filter((l) => stageOf(l.status) >= k && !is(l.status, 'Hủy')).length))
  const funnel: FunnelRow[] = funnelStages.map((label, k) => ({
    label,
    value: formatCount(reached[k]),
    percent: reached[0] ? Math.round((reached[k] / reached[0]) * 100) : 0,
  }))

  // ---- Công việc
  const openTasks = db.tasks.filter((t) => !is(t.status, 'Hoàn thành'))
  const dueToday = openTasks.filter((t) => t.due && t.due < tomorrow)
  const byDept = new Map<string, number>()
  dueToday.forEach((t) => byDept.set(t.department || 'Khác', (byDept.get(t.department || 'Khác') ?? 0) + 1))
  const deptMeta = [...byDept].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([d, n]) => `${n} ${d}`).join(' · ')

  const tasks: Task[] = openTasks
    .filter((t) => t.due)
    .sort((a, b) => a.due!.getTime() - b.due!.getTime())
    .slice(0, 5)
    .map((t, i) => {
      const due = t.due!
      const tag: Task['tag'] =
        due < now
          ? { label: 'Quá hạn', tone: 'red' }
          : is(t.priority, 'Cao')
            ? { label: 'Ưu tiên', tone: 'red' }
            : due < tomorrow
              ? { label: 'Hôm nay', tone: 'orange' }
              : { label: t.department || 'Khác', tone: DEPT_TONE[normalize(t.department)] ?? 'gray' }
      const note = [t.department, t.assignee, `hạn ${formatTime(due, today)}`].filter(Boolean).join(' · ')
      return { id: t.code || `task-${i}`, title: t.title, note, tag }
    })

  // ---- Cảnh báo
  const threshold = config.attendanceThreshold
  const atRisk = active.filter((s) => s.attendance != null && (s.attendance <= 1 ? s.attendance * 100 : s.attendance) < threshold).length

  const slaCutoff = new Date(today.getTime() - config.hotLeadSlaDays * DAY)
  const hotOverdue = db.leads.filter((l) => is(l.status, 'Hot lead') && l.followUp && l.followUp < slaCutoff).length

  const paid = new Map<string, number>()
  db.transactions.forEach((t) => paid.set(t.enrollmentCode, (paid.get(t.enrollmentCode) ?? 0) + signedAmount(t)))
  const owing = db.enrollments.filter((e) => e.due && (e.value ?? 0) - (paid.get(e.code) ?? 0) > 0)
  const reminderEnd = new Date(tomorrow.getTime() + config.paymentReminderDays * DAY)
  const dueSoon = owing.filter((e) => inRange(e.due, today, reminderEnd)).length
  const overduePayments = owing.filter((e) => e.due! < today).length

  const classIssues = db.classes.filter((c) => c.needs && !is(c.status, 'Kết thúc'))

  const alerts: Alert[] = [
    { count: atRisk, tone: 'red', title: 'Nguy cơ bỏ học', note: `Học viên đang học có chuyên cần dưới ${threshold}%` },
    {
      count: hotOverdue,
      tone: 'orange',
      title: 'Hot lead quá hạn',
      note: config.hotLeadSlaDays > 0 ? `Quá ngày follow-up hơn ${config.hotLeadSlaDays} ngày` : 'Đã quá ngày follow-up',
    },
    {
      count: dueSoon,
      tone: 'blue',
      title: 'Thanh toán sắp đến hạn',
      note: `Trong ${config.paymentReminderDays} ngày tới${overduePayments ? ` · ${overduePayments} đã quá hạn` : ''}`,
    },
    {
      count: classIssues.length,
      tone: 'gray',
      title: 'Lớp cần điều phối',
      note: classIssues.length ? classIssues.slice(0, 2).map((c) => `${c.code}: ${c.needs}`).join(' · ') : 'Không có lớp cần điều phối',
    },
  ]

  // ---- Biểu đồ 6 tháng
  const months = [5, 4, 3, 2, 1, 0].map((i) => {
    const from = startOfMonth(now, -i)
    return { month: `T${from.getMonth() + 1}`, raw: revenueIn(from, startOfMonth(now, -i + 1)) }
  })
  const max = Math.max(...months.map((m) => m.raw))
  const revenue = months.map((m) => ({
    month: m.month,
    value: formatShort(m.raw),
    percent: max > 0 ? Math.max(m.raw > 0 ? 2 : 0, Math.round((m.raw / max) * 90)) : 0,
  }))

  // ---- Hoạt động gần đây
  const activities: Activity[] = db.logs
    .filter((l) => l.time)
    .sort((a, b) => b.time!.getTime() - a.time!.getTime())
    .slice(0, 8)
    .map((l) => ({
      time: formatTime(l.time!, today),
      student: l.name || l.targetCode || '—',
      event: l.event,
      department: l.department || '—',
      actor: l.actor || '—',
      status: { label: l.result || '—', tone: resultTone(l.result) },
    }))

  const kpis: Kpi[] = [
    { label: 'Tổng học viên', icon: '◎', value: formatCount(totalStudents), ...changeMeta(pctChange(totalStudents, studentsBeforeMonth), 'so với tháng trước') },
    { label: 'Đang học', icon: '◒', value: formatCount(active.length), meta: `${newActive} học viên mới tháng này`, metaClass: newActive > 0 ? 'up' : undefined },
    { label: 'Doanh thu tháng', icon: '₫', value: formatShort(revenueMonth), ...changeMeta(pctChange(revenueMonth, revenuePrev), `thu thực tế ${formatShort(collectedMonth)}`) },
    {
      label: 'Data trong phễu',
      icon: '◫',
      value: formatCount(openLeads.length),
      meta: `${openLeads.filter((l) => is(l.status, 'Tư vấn')).length} đang tư vấn · ${openLeads.filter((l) => is(l.status, 'Hot lead')).length} hot`,
      metaClass: 'blue',
    },
    { label: 'Cần xử lý hôm nay', icon: '!', value: formatCount(dueToday.length), meta: deptMeta || 'Không có việc đến hạn', metaClass: dueToday.length ? 'warn' : undefined },
  ]

  return { kpis, revenue, funnel, tasks, alerts, activities }
}
