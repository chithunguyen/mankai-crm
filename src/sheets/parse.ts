// Chuyển giá trị thô từ Sheets API (valueRenderOption=UNFORMATTED_VALUE, dateTimeRenderOption=SERIAL_NUMBER)
// thành dữ liệu có kiểu. Chấp nhận cả ngày/số nhập dạng chữ (vd. "23/09/2026", "6.990.000").

import { normalize } from '../utils/format'
import { CONFIG_KEYS, TABS, type ColumnDef, type ConfigKey, type TabDef, type TabKey } from './schema'

export type Cell = string | number | boolean | null | undefined

/** Serial ngày kiểu Google Sheets/Excel: số ngày tính từ 30/12/1899. */
export function serialToDate(serial: number): Date {
  const utc = new Date(Date.UTC(1899, 11, 30) + Math.round(serial * 86400000))
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), utc.getUTCHours(), utc.getUTCMinutes(), utc.getUTCSeconds())
}

export function toDate(v: Cell): Date | null {
  if (typeof v === 'number' && Number.isFinite(v)) return serialToDate(v)
  if (typeof v !== 'string' || !v.trim()) return null
  const s = v.trim()
  const vn = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/)
  if (vn) {
    const [, d, m, y, hh = '0', mi = '0', ss = '0'] = vn
    const date = new Date(+y, +m - 1, +d, +hh, +mi, +ss)
    return date.getMonth() === +m - 1 ? date : null
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)
  if (iso) {
    const [, y, m, d, hh = '0', mi = '0', ss = '0'] = iso
    return new Date(+y, +m - 1, +d, +hh, +mi, +ss)
  }
  return null
}

export function toNumber(v: Cell): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v !== 'string') return null
  let s = v.trim().replace(/\s|đ|vnd|%/gi, '')
  if (!s) return null
  // "6.990.000" hoặc "6,990,000" → bỏ dấu phân cách hàng nghìn
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '')
  else s = s.replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export const toText = (v: Cell) => (v == null ? '' : String(v).trim())

/** So khớp trạng thái không phân biệt hoa thường/dấu. */
export const is = (value: string, label: string) => normalize(value) === normalize(label)

type Parsed<C extends Record<string, ColumnDef>> = {
  [K in keyof C]: C[K]['kind'] extends 'number' ? number | null : C[K]['kind'] extends 'date' | 'datetime' ? Date | null : string
}

function convert(kind: ColumnDef['kind'], v: Cell) {
  if (kind === 'number') return toNumber(v)
  if (kind === 'date' || kind === 'datetime') return toDate(v)
  return toText(v)
}

/** Đọc một tab: dòng 1 là tiêu đề, bỏ qua dòng trống. Trả về các cột bắt buộc bị thiếu. */
export function readTab<T extends TabDef>(tab: T, values: Cell[][]): { rows: Parsed<T['cols']>[]; missing: string[] } {
  const [header = [], ...body] = values
  const index = new Map(header.map((h, i) => [normalize(toText(h)), i]))
  const keys = Object.keys(tab.cols) as (keyof T['cols'] & string)[]
  const pos = Object.fromEntries(keys.map((k) => [k, index.get(normalize(tab.cols[k].header))]))
  const missing = keys.filter((k) => tab.cols[k].required && pos[k] === undefined).map((k) => tab.cols[k].header)

  const rows = body
    .filter((r) => r.some((c) => toText(c) !== ''))
    .map((r) => Object.fromEntries(keys.map((k) => [k, convert(tab.cols[k].kind, pos[k] === undefined ? undefined : r[pos[k]!])])) as Parsed<T['cols']>)
  return { rows, missing }
}

type Tabs = typeof TABS
export type LeadRow = Parsed<Tabs['lead']['cols']>
export type StudentRow = Parsed<Tabs['student']['cols']>
export type EnrollmentRow = Parsed<Tabs['enrollment']['cols']>
export type TransactionRow = Parsed<Tabs['transaction']['cols']>
export type ClassRow = Parsed<Tabs['class']['cols']>
export type TaskRow = Parsed<Tabs['task']['cols']>
export type LogRow = Parsed<Tabs['log']['cols']>
export type Config = Record<ConfigKey, number>

export interface SheetDB {
  leads: LeadRow[]
  students: StudentRow[]
  enrollments: EnrollmentRow[]
  transactions: TransactionRow[]
  classes: ClassRow[]
  tasks: TaskRow[]
  logs: LogRow[]
  config: Config
}

/**
 * Dựng SheetDB từ dữ liệu các tab (key = tên tab trong file). Trả về danh sách vấn đề
 * (thiếu tab / thiếu cột) — có vấn đề thì không nên hiển thị số liệu.
 */
export function parseSheet(tabs: Record<string, Cell[][]>): { db: SheetDB; problems: string[] } {
  const byName = new Map(Object.entries(tabs).map(([name, values]) => [normalize(name), values]))
  const problems: string[] = []

  const load = <K extends TabKey>(key: K) => {
    const tab: TabDef = TABS[key]
    const values = byName.get(normalize(tab.sheet))
    if (!values) {
      if (!('optional' in tab && tab.optional)) problems.push(`Thiếu tab "${tab.sheet}"`)
      return [] as Parsed<Tabs[K]['cols']>[]
    }
    const { rows, missing } = readTab(TABS[key], values)
    if (missing.length) problems.push(`Tab "${tab.sheet}" thiếu cột: ${missing.map((m) => `"${m}"`).join(', ')}`)
    return rows as Parsed<Tabs[K]['cols']>[]
  }

  const configRows = load('config')
  const config = Object.fromEntries(
    (Object.keys(CONFIG_KEYS) as ConfigKey[]).map((k) => {
      const row = configRows.find((r) => normalize(r.key) === normalize(CONFIG_KEYS[k].label))
      return [k, row?.value ?? CONFIG_KEYS[k].default]
    }),
  ) as Config

  const db: SheetDB = {
    leads: load('lead'),
    students: load('student'),
    enrollments: load('enrollment'),
    transactions: load('transaction'),
    classes: load('class'),
    tasks: load('task'),
    logs: load('log'),
    config,
  }
  return { db, problems }
}
