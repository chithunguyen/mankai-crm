import { useEffect, useState } from 'react'
import { DataTable, PageHeader, StatusBadge } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import type { AutomationSetting } from '../types'

export function PermissionsPage() {
  const { data: roles = [] } = useData(api.listRoles)
  const openModal = useModal()

  return (
    <section>
      <PageHeader
        title="Phân quyền"
        subtitle="RBAC theo vai trò + phạm vi dữ liệu theo phòng ban"
        actions={<button className="btn" onClick={() => openModal('account')}>＋ Tạo tài khoản</button>}
      />
      <div className="permission-grid">
        {roles.map((r) => (
          <div className="card permission" key={r.name}>
            <h3>{r.name}</h3>
            <StatusBadge status={r.badge} />
            <ul>{r.permissions.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AuditLogPage() {
  const { data: logs = [] } = useData(api.listAuditLogs)
  const toast = useToast()

  return (
    <section>
      <PageHeader
        title="Audit log"
        subtitle="Ai đã làm gì · lúc nào · trên đối tượng nào"
        actions={<button className="btn secondary" onClick={() => toast('Đã tải audit log demo')}>↓ Xuất log</button>}
      />
      <div className="card">
        <DataTable
          rows={logs}
          rowKey={(l) => l.time + l.user}
          columns={[
            { header: 'Thời gian', render: (l) => l.time },
            { header: 'Người dùng', render: (l) => l.user },
            { header: 'Bộ phận', render: (l) => l.department },
            { header: 'Hành động', render: (l) => l.action },
            { header: 'Đối tượng', render: (l) => l.target },
            { header: 'IP / nguồn', render: (l) => l.origin },
          ]}
        />
      </div>
    </section>
  )
}

export function SettingsPage() {
  const { data } = useData(api.getSettings)
  const toast = useToast()
  const [automations, setAutomations] = useState<AutomationSetting[]>([])
  useEffect(() => setAutomations(data?.automations ?? []), [data])
  if (!data) return null

  const toggle = (id: string) => setAutomations((xs) => xs.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)))

  return (
    <section>
      <PageHeader
        title="Cài đặt hệ thống"
        subtitle="Thiết lập trạng thái, SLA, thông báo và quy tắc vận hành"
        actions={<button className="btn" onClick={() => toast('Đã lưu cấu hình demo')}>Lưu thay đổi</button>}
      />
      <div className="settings-grid">
        <div className="card setting">
          <div className="sect-title">Tự động hóa</div>
          {automations.map((a) => (
            <div className="setting-row" key={a.id}>
              <div><b>{a.title}</b><small className="muted-sm" style={{ color: '#667085' }}>{a.note}</small></div>
              <button className={`switch ${a.enabled ? 'on' : ''}`} onClick={() => toggle(a.id)} role="switch" aria-checked={a.enabled} aria-label={a.title}>
                <span />
              </button>
            </div>
          ))}
        </div>
        <div className="card setting">
          <div className="sect-title">Quy tắc journey</div>
          {data.journeyRules.map((r) => (
            <div className="setting-row" key={r.title}>
              <div><b>{r.title}</b><small className="muted-sm" style={{ color: '#667085' }}>{r.note}</small></div>
              <StatusBadge status={r.badge} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
