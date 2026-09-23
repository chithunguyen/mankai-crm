import { useNavigate } from 'react-router'
import { DataTable, Funnel, KpiCard, PageHeader, ProgressBar, StatusBadge } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'

export function ClassesPage() {
  const { data } = useData(api.getClasses)
  const openModal = useModal()
  if (!data) return null

  return (
    <section>
      <PageHeader
        title="Lớp học & lịch"
        subtitle="Quản lý lớp, giáo viên, lịch học, sĩ số và tình trạng vận hành"
        actions={<button className="btn" onClick={() => openModal('class')}>＋ Tạo lớp</button>}
      />
      <div className="class-grid">
        {data.classes.map((c) => (
          <div className="card class-card" key={c.code}>
            <h3>{c.code}</h3>
            <div className="class-meta">{c.teacher} · {c.enrolled}/{c.capacity} học viên · KG {c.startDate}</div>
            <div className="metrics-row"><span>Tiến độ</span><b>{c.progress}%</b></div>
            <ProgressBar percent={c.progress} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <StatusBadge status={c.status} />
              <StatusBadge status={c.extra} />
            </div>
          </div>
        ))}
      </div>
      <div className="two-col" style={{ marginTop: 14 }}>
        <div className="card pad">
          <div className="sect-title" style={{ marginBottom: 12 }}>Lịch học hôm nay</div>
          <div className="schedule">
            {data.schedule.map((s) => (
              <div className="schedule-row" key={s.time + s.detail}>
                <b>{s.time}</b><span>{s.detail}</span><StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="card pad">
          <div className="sect-title">Sĩ số & cảnh báo</div>
          <Funnel rows={data.capacity} />
        </div>
      </div>
    </section>
  )
}

export function ProgressPage() {
  const { data: rows = [] } = useData(api.listLearningProgress)
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <section>
      <PageHeader
        title="Tiến độ học tập"
        subtitle="Theo dõi attendance · bài tập · LMS · mức độ hoàn thành · nguy cơ bỏ học"
        actions={<button className="btn secondary" onClick={() => toast('Đã xuất báo cáo tiến độ demo')}>↓ Xuất báo cáo</button>}
      />
      <div className="card">
        <DataTable
          rows={rows}
          rowKey={(r) => r.code}
          columns={[
            { header: 'Học viên', render: (r) => r.name },
            { header: 'Lớp', render: (r) => r.classCode },
            { header: 'Attendance', render: (r) => `${r.attendance}%` },
            { header: 'Bài tập', render: (r) => `${r.homework}%` },
            { header: 'LMS', render: (r) => `${r.lms}%` },
            { header: 'Tiến độ', render: (r) => `${r.progress}%` },
            { header: 'Cảnh báo', render: (r) => <StatusBadge status={r.warning} /> },
            {
              header: 'Hành động',
              render: (r) =>
                r.warning.tone === 'red' ? (
                  <button className="btn soft" onClick={() => toast('Đã tạo task chăm sóc')}>Tạo task</button>
                ) : (
                  <button className="btn secondary" onClick={() => navigate(`/students/${r.code}`)}>Mở 360°</button>
                ),
            },
          ]}
        />
      </div>
    </section>
  )
}

export function ResultsPage() {
  const { data } = useData(api.listExamResults)
  const openModal = useModal()
  if (!data) return null

  return (
    <section>
      <PageHeader
        title="Kết quả & JLPT"
        subtitle="Điểm test, kết quả JLPT, mốc tiến bộ và cơ hội học tiếp"
        actions={<button className="btn" onClick={() => openModal('result')}>＋ Nhập kết quả</button>}
      />
      <div className="finance-grid">
        {data.kpis.map((k) => <KpiCard key={k.label} kpi={k} variant="finance" />)}
      </div>
      <div className="card pad" style={{ marginTop: 14 }}>
        <DataTable
          rows={data.results}
          rowKey={(r) => r.name + r.course}
          columns={[
            { header: 'Học viên', render: (r) => r.name },
            { header: 'Khóa', render: (r) => r.course },
            { header: 'Điểm gần nhất', render: (r) => r.latest },
            { header: 'Mục tiêu', render: (r) => r.target },
            { header: 'Thay đổi', render: (r) => (r.change > 0 ? `+${r.change}` : r.change), className: (r) => (r.change >= 0 ? 'up' : 'danger') },
            { header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            { header: 'Next action', render: (r) => r.nextAction },
          ]}
        />
      </div>
    </section>
  )
}
