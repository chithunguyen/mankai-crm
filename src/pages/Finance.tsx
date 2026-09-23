import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, DataTable, KpiCard, PageHeader, SectionHead, Select, StatusBadge } from '../components/ui'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import { formatVND, normalize } from '../utils/format'

export function FinancePage() {
  const { data } = useData(api.getFinance)
  const navigate = useNavigate()
  const openModal = useModal()
  if (!data) return null

  return (
    <section>
      <PageHeader
        title="Kế toán & công nợ"
        subtitle="Doanh thu · phải thu · công nợ · kỳ thanh toán · đối soát"
        actions={<button className="btn" onClick={() => openModal('payment')}>＋ Ghi nhận thanh toán</button>}
      />
      <div className="finance-grid">
        {data.kpis.map((k) => <KpiCard key={k.label} kpi={k} variant="finance" />)}
      </div>
      <div className="card pad" style={{ marginTop: 14 }}>
        <SectionHead title="Công nợ cần xử lý" link="Xem giao dịch →" onLink={() => navigate('/transactions')} />
        <DataTable
          rows={data.debts}
          rowKey={(d) => d.name + d.course}
          columns={[
            { header: 'Học viên', render: (d) => d.name },
            { header: 'Khóa', render: (d) => d.course },
            { header: 'Giá trị', render: (d) => d.value },
            { header: 'Đã thu', render: (d) => d.paid },
            { header: 'Còn lại', render: (d) => d.remaining },
            { header: 'Hạn', render: (d) => d.due, className: (d) => (d.overdue ? 'danger' : undefined) },
            { header: 'Phụ trách', render: (d) => d.owner },
            { header: 'Trạng thái', render: (d) => <StatusBadge status={d.status} /> },
          ]}
        />
      </div>
    </section>
  )
}

export function TransactionsPage() {
  const { data: txs = [] } = useData(api.listTransactions)
  const openModal = useModal()
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [reconciled, setReconciled] = useState('')

  const rows = txs.filter(
    (t) =>
      (!q || normalize(`${t.code} ${t.student}`).includes(normalize(q))) &&
      (!type || t.type === type) &&
      (!reconciled || (reconciled === 'Đã đối soát') === t.reconciled),
  )

  return (
    <section>
      <PageHeader
        title="Giao dịch"
        subtitle="Lịch sử thu tiền, hoàn tiền, công nợ và đối soát"
        actions={<button className="btn" onClick={() => openModal('payment')}>＋ Ghi nhận thanh toán</button>}
      />
      <div className="filters">
        <input placeholder="Tìm mã giao dịch / học viên" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select all="Tất cả loại" value={type} onChange={setType} options={['Thu học phí', 'Hoàn tiền', 'Điều chỉnh']} />
        <Select all="Tất cả trạng thái" value={reconciled} onChange={setReconciled} options={['Đã đối soát', 'Chờ đối soát']} />
      </div>
      <div className="card">
        <DataTable
          rows={rows}
          rowKey={(t) => t.code}
          columns={[
            { header: 'Thời gian', render: (t) => t.time },
            { header: 'Mã GD', render: (t) => t.code },
            { header: 'Học viên', render: (t) => t.student },
            { header: 'Nội dung', render: (t) => t.content },
            { header: 'Số tiền', render: (t) => formatVND(t.amount) },
            { header: 'Phương thức', render: (t) => t.method },
            { header: 'Người ghi nhận', render: (t) => t.recordedBy },
            { header: 'Đối soát', render: (t) => (t.reconciled ? <Badge tone="green">Đã đối soát</Badge> : <Badge tone="orange">Chờ</Badge>) },
          ]}
        />
      </div>
    </section>
  )
}
