// Kiểu dữ liệu dùng chung. Khi có backend, đây là "hợp đồng" giữa UI và API.

export type Tone = 'orange' | 'green' | 'blue' | 'red' | 'gray'

export interface Status {
  label: string
  tone: Tone
}

export interface Kpi {
  label: string
  value: string
  icon?: string
  meta?: string
  metaClass?: 'up' | 'warn' | 'danger' | 'blue'
  valueClass?: string
}

export interface FunnelRow {
  label: string
  value: string
  percent: number
}

export interface Task {
  id: string
  title: string
  note: string
  tag: { label: string; tone: Tone }
  done?: boolean
}

export interface Alert {
  count: number
  tone: Tone
  title: string
  note: string
}

export interface Activity {
  time: string
  student: string
  event: string
  department: string
  actor: string
  status: Status
}

export interface RevenuePoint {
  month: string
  value: string
  percent: number
}

export interface Dashboard {
  kpis: Kpi[]
  revenue: RevenuePoint[]
  funnel: FunnelRow[]
  tasks: Task[]
  alerts: Alert[]
  activities: Activity[]
}

export interface Student {
  code: string
  name: string
  initials: string
  phoneMasked: string
  journey: Status
  course: string
  courseLevel: string
  sale: string
  progress: number | null
  payment: string
  followUp: string
  followUpOverdue?: boolean
}

export interface StudentDetail {
  code: string
  email: string
  source: string
  /** Index trong JOURNEY_STEPS của bước hiện tại */
  journeyStep: number
  info: { label: string; value: string }[]
  timeline: { date: string; title: string; note: string }[]
  learning: { label: string; percent: number; note: string; noteClass?: string }[]
  owners: { role: string; name: string }[]
  lastTouch: { time: string; channel: string }
  finance: { amount: string; note: string; badge: Status }
  nextOpportunity: { course: string; note: string } | null
}

export interface Lead {
  name: string
  source: string
  createdAt: string
  sale: string
  status: Status
  lastTouch: string
  nextAction: string
  nextActionUrgent?: boolean
  value: string
}

export interface PipelineStage {
  name: string
  count: number
  tone: Tone
  cards: { name: string; note: string; sale: string; value: string }[]
}

export interface SourceStat {
  source: string
  data: number
  connected: string
  consulting: string
  hot: string
  registered: string
  revenue: string
}

export interface ClassRoom {
  code: string
  teacher: string
  enrolled: number
  capacity: number
  startDate: string
  progress: number
  status: Status
  extra: Status
}

export interface ScheduleItem {
  time: string
  detail: string
  status: Status
}

export interface LearningProgress {
  code: string
  name: string
  classCode: string
  attendance: number
  homework: number
  lms: number
  progress: number
  warning: Status
}

export interface ExamResult {
  name: string
  course: string
  latest: string
  target: string
  change: number
  status: Status
  nextAction: string
}

export interface OpsCard {
  title: string
  note: string
  action: string
  to?: string
  toast?: string
}

export interface Debt {
  name: string
  course: string
  value: string
  paid: string
  remaining: string
  due: string
  overdue?: boolean
  owner: string
  status: Status
}

export interface Transaction {
  time: string
  code: string
  student: string
  content: string
  amount: number
  type: 'Thu học phí' | 'Hoàn tiền' | 'Điều chỉnh'
  method: string
  recordedBy: string
  reconciled: boolean
}

export interface RoleDef {
  name: string
  badge: Status
  permissions: string[]
}

export interface AuditLog {
  time: string
  user: string
  department: string
  action: string
  target: string
  origin: string
}

export interface AutomationSetting {
  id: string
  title: string
  note: string
  enabled: boolean
}

export interface JourneyRule {
  title: string
  note: string
  badge: Status
}
