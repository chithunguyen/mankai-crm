import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, DataTable, Funnel, KpiGrid, PageHeader, SectionHead, StatusBadge, TaskList } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import { computeDashboard } from '../sheets/compute'
import { SheetConnectPanel, SourceBar } from '../sheets/SheetPanels'
import { useSheet } from '../sheets/SheetProvider'
import type { Dashboard } from '../types'

export function DashboardPage() {
  const sheet = useSheet()
  const demo = useData(api.getDashboard)
  const live = useMemo(() => (sheet.db ? computeDashboard(sheet.db, new Date(sheet.loadedAt ?? Date.now())) : undefined), [sheet.db, sheet.loadedAt])
  const [configuring, setConfiguring] = useState(false)
  const toast = useToast()
  const openModal = useModal()

  const isSheet = sheet.mode === 'sheet'
  const data = isSheet ? live : demo.data
  const showPanel = isSheet && (!live || configuring)

  return (
    <section>
      <PageHeader
        title="Tổng quan Mankai"
        subtitle="Toàn cảnh doanh thu · data · vận hành · đào tạo · hành trình học viên"
        actions={
          <>
            <button className="btn secondary" onClick={() => toast('Đã tải báo cáo demo')}>↓ Xuất báo cáo</button>
            <button className="btn" onClick={() => openModal('student')}>＋ Tạo học viên</button>
          </>
        }
      />
      <SourceBar onConfigure={() => setConfiguring(true)} />
      {showPanel && <SheetConnectPanel onDone={() => setConfiguring(false)} />}
      {data && !showPanel && <DashboardView data={data} source={isSheet ? 'Google Sheet' : 'dữ liệu demo'} />}
    </section>
  )
}

function DashboardView({ data, source }: { data: Dashboard; source: string }) {
  const navigate = useNavigate()
  return (
    <>
      <KpiGrid kpis={data.kpis} />

      <div className="dashboard-grid">
        <div className="card chartcard">
          <div className="sect-head">
            <div>
              <div className="sect-title">Doanh thu & thu tiền</div>
              <div className="subtitle">6 tháng gần nhất · {source}</div>
            </div>
            <div className="legend"><span><i />Doanh thu</span></div>
          </div>
          <div className="chart">
            {data.revenue.map((p) => (
              <div className="barcol" key={p.month} title={`${p.month}: ${p.value}`}>
                <div className="barinner" style={{ height: `${p.percent}%` }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.revenue.length},1fr)`, gap: 10 }}>
            {data.revenue.map((p) => (
              <div className="barlabel" key={p.month}>{p.month}<br /><b>{p.value}</b></div>
            ))}
          </div>
        </div>
        <div className="card chartcard">
          <SectionHead title="Phễu học viên" link="Xem pipeline →" onLink={() => navigate('/pipeline')} />
          <Funnel rows={data.funnel} />
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card chartcard">
          <SectionHead title="Công việc cần xử lý hôm nay" link="Xem tất cả →" onLink={() => navigate('/tasks')} />
          <TaskList tasks={data.tasks} />
        </div>
        <div className="card chartcard">
          <SectionHead title="Cảnh báo hệ thống" />
          <div className="alertlist">
            {data.alerts.map((a) => (
              <div className="alert" key={a.title}>
                <Badge tone={a.tone}>{a.count}</Badge>
                <div><b>{a.title}</b><small>{a.note}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card pad" style={{ marginTop: 14 }}>
        <SectionHead title="Hoạt động gần đây" link="Xem Audit log →" onLink={() => navigate('/logs')} />
        <DataTable
          rows={data.activities}
          rowKey={(r) => r.time + r.student + r.event}
          columns={[
            { header: 'Thời gian', render: (r) => r.time },
            { header: 'Học viên', render: (r) => r.student },
            { header: 'Sự kiện', render: (r) => r.event },
            { header: 'Bộ phận', render: (r) => r.department },
            { header: 'Người thực hiện', render: (r) => r.actor },
            { header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </>
  )
}
