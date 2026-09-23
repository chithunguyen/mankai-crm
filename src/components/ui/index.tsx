import type { ReactNode } from 'react'
import type { FunnelRow, Kpi, Status, Task, Tone } from '../../types'

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`badge b-${tone}`}>{children}</span>
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={status.tone}>{status.label}</Badge>
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="pagehead">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  )
}

export function KpiCard({ kpi, variant = 'kpi' }: { kpi: Kpi; variant?: 'kpi' | 'finance' }) {
  const label = <span className="kpi-label">{kpi.label}</span>
  const meta = kpi.meta && <div className={`kpi-meta ${kpi.metaClass ?? ''}`}>{kpi.meta}</div>
  if (variant === 'finance') {
    return (
      <div className="card finance-card">
        <div className="kpi-label">{kpi.label}</div>
        <div className="num">{kpi.value}</div>
        {meta}
      </div>
    )
  }
  return (
    <div className="card kpi">
      {kpi.icon ? (
        <div className="kpi-top">
          {label}
          <span className="kpi-icon">{kpi.icon}</span>
        </div>
      ) : (
        <div className="kpi-label">{kpi.label}</div>
      )}
      <div className={`kpi-num ${kpi.valueClass ?? ''}`}>{kpi.value}</div>
      {meta}
    </div>
  )
}

export function KpiGrid({ kpis, columns }: { kpis: Kpi[]; columns?: number }) {
  return (
    <div className="kpis" style={columns ? { gridTemplateColumns: `repeat(${columns},1fr)` } : undefined}>
      {kpis.map((k) => (
        <KpiCard key={k.label} kpi={k} />
      ))}
    </div>
  )
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${percent}%` }} />
    </div>
  )
}

export function Funnel({ rows }: { rows: FunnelRow[] }) {
  return (
    <div className="funnel">
      {rows.map((r) => (
        <div className="frow" key={r.label}>
          <span>{r.label}</span>
          <div className="fbar">
            <span style={{ width: `${r.percent}%` }} />
          </div>
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  )
}

export function SectionHead({ title, link, onLink }: { title: ReactNode; link?: string; onLink?: () => void }) {
  return (
    <div className="sect-head">
      <div className="sect-title">{title}</div>
      {link && (
        <span className="sect-link" onClick={onLink}>
          {link}
        </span>
      )}
    </div>
  )
}

export function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle?: (id: string) => void }) {
  return (
    <div className="tasklist">
      {tasks.map((t) => (
        <div className={`task ${t.done ? 'done' : ''}`} key={t.id}>
          <button className={`check ${t.done ? 'done' : ''}`} onClick={() => onToggle?.(t.id)} aria-label="Đánh dấu hoàn thành">
            {t.done ? '✓' : ''}
          </button>
          <div className="task-main">
            <b>{t.title}</b>
            <small>{t.note}</small>
          </div>
          <span className={`tag ${t.tag.tone}`}>{t.tag.label}</span>
        </div>
      ))}
    </div>
  )
}

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: (row: T) => string | undefined
}

export function DataTable<T>({ columns, rows, rowKey, empty = 'Không có dữ liệu' }: { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; empty?: string }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c, i) => (
                <td key={i} className={c.className?.(row)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="empty">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Select({ value, onChange, options, all }: { value: string; onChange: (v: string) => void; options: string[]; all: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{all}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export const unique = <T,>(items: T[], pick: (x: T) => string) => [...new Set(items.map(pick))]
