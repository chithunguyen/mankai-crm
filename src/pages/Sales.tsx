import { useState } from 'react'
import { Badge, DataTable, KpiGrid, PageHeader, Select, StatusBadge, unique } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import { normalize } from '../utils/format'

export function DataSalePage() {
  const { data } = useData(api.getSales)
  const toast = useToast()
  const openModal = useModal()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [sale, setSale] = useState('')
  if (!data) return null

  const rows = data.leads.filter(
    (l) =>
      (!q || normalize(l.name).includes(normalize(q))) &&
      (!status || l.status.label === status) &&
      (!source || l.source === source) &&
      (!sale || l.sale === sale),
  )

  return (
    <section>
      <PageHeader
        title="Data & Sale"
        subtitle="Quản lý data, ownership, kết nối, tư vấn, follow-up và SLA"
        actions={
          <>
            <button className="btn secondary" onClick={() => toast('Đã mở import demo')}>↑ Import</button>
            <button className="btn" onClick={() => openModal('lead')}>＋ Nhập data</button>
          </>
        }
      />
      <KpiGrid kpis={data.kpis} columns={4} />
      <div className="filters" style={{ marginTop: 14 }}>
        <input placeholder="Tìm tên / SĐT / Zalo" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select all="Tất cả trạng thái" value={status} onChange={setStatus} options={unique(data.leads, (l) => l.status.label)} />
        <Select all="Tất cả nguồn" value={source} onChange={setSource} options={unique(data.leads, (l) => l.source)} />
        <Select all="Tất cả Sale" value={sale} onChange={setSale} options={unique(data.leads, (l) => l.sale)} />
        <button className="btn soft" onClick={() => toast('Đã áp dụng bộ lọc nâng cao')}>Bộ lọc nâng cao</button>
      </div>
      <div className="card">
        <DataTable
          rows={rows}
          rowKey={(l) => l.name}
          columns={[
            { header: 'Học viên', render: (l) => l.name },
            { header: 'Nguồn', render: (l) => l.source },
            { header: 'Ngày vào', render: (l) => l.createdAt },
            { header: 'Sale', render: (l) => l.sale },
            { header: 'Trạng thái', render: (l) => <StatusBadge status={l.status} /> },
            { header: 'Last touch', render: (l) => l.lastTouch },
            { header: 'Next action', render: (l) => (l.nextActionUrgent ? <span className="danger">{l.nextAction}</span> : l.nextAction) },
            { header: 'Giá trị', render: (l) => l.value },
          ]}
        />
      </div>
    </section>
  )
}

export function PipelinePage() {
  const { data: stages = [] } = useData(api.getPipeline)
  const openModal = useModal()

  return (
    <section>
      <PageHeader
        title="Pipeline cơ hội"
        subtitle="Nhìn toàn bộ cơ hội bán hàng theo từng trạng thái"
        actions={<button className="btn" onClick={() => openModal('lead')}>＋ Tạo cơ hội</button>}
      />
      <div className="pipeline">
        {stages.map((st) => (
          <div className="stage" key={st.name}>
            <div className="stagehead"><span>{st.name}</span><Badge tone={st.tone}>{st.count}</Badge></div>
            {st.cards.map((c) => (
              <div className="leadcard" key={c.name}>
                <b>{c.name}</b>
                <p>{c.note}</p>
                <div className="leadfoot"><span>{c.sale}</span><span>{c.value}</span></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export function SourcesPage() {
  const { data: sources = [] } = useData(api.listSources)
  const toast = useToast()

  return (
    <section>
      <PageHeader
        title="Nguồn Data"
        subtitle="Đo chất lượng và chuyển đổi theo từng nguồn"
        actions={<button className="btn secondary" onClick={() => toast('Báo cáo nguồn data đã sẵn sàng')}>↓ Xuất báo cáo</button>}
      />
      <div className="card pad">
        <DataTable
          rows={sources}
          rowKey={(s) => s.source}
          columns={[
            { header: 'Nguồn', render: (s) => <b>{s.source}</b> },
            { header: 'Data', render: (s) => s.data },
            { header: 'Đã kết nối', render: (s) => s.connected },
            { header: 'Tư vấn', render: (s) => s.consulting },
            { header: 'Hot', render: (s) => s.hot },
            { header: 'Đăng ký', render: (s) => s.registered },
            { header: 'Doanh thu', render: (s) => s.revenue },
          ]}
        />
      </div>
    </section>
  )
}
