import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Badge, DataTable, PageHeader, ProgressBar, Select, StatusBadge, unique } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { JOURNEY_STEPS } from '../data/mock/students'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import { normalize } from '../utils/format'

export function StudentsPage() {
  const { data: students = [] } = useData(api.listStudents)
  const navigate = useNavigate()
  const toast = useToast()
  const openModal = useModal()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [course, setCourse] = useState('')
  const [sale, setSale] = useState('')

  const rows = students.filter(
    (s) =>
      (!q || normalize(`${s.name} ${s.code} ${s.phoneMasked}`).includes(normalize(q))) &&
      (!status || s.journey.label === status) &&
      (!course || s.courseLevel === course) &&
      (!sale || s.sale === sale),
  )

  return (
    <section>
      <PageHeader
        title="Học viên 360°"
        subtitle="Một hồ sơ · toàn bộ lịch sử từ Lead đến học tiếp"
        actions={
          <>
            <button className="btn secondary" onClick={() => toast('Đã tải danh sách demo')}>↓ Xuất danh sách</button>
            <button className="btn" onClick={() => openModal('student')}>＋ Thêm học viên</button>
          </>
        }
      />
      <div className="filters">
        <input placeholder="Tìm tên / SĐT / mã HV" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select all="Tất cả trạng thái" value={status} onChange={setStatus} options={unique(students, (s) => s.journey.label)} />
        <Select all="Tất cả khóa" value={course} onChange={setCourse} options={['N1', 'N2', 'N3', 'TNGĐ']} />
        <Select all="Tất cả Sale" value={sale} onChange={setSale} options={unique(students, (s) => s.sale)} />
        <button className="btn soft" onClick={() => toast('Bộ lọc nâng cao sẽ có khi nối dữ liệu thật')}>＋ Bộ lọc nâng cao</button>
      </div>
      <div className="card">
        <DataTable
          rows={rows}
          rowKey={(s) => s.code}
          columns={[
            {
              header: 'Học viên',
              render: (s) => (
                <div className="person">
                  <span className="miniavatar">{s.initials}</span>
                  <div><b>{s.name}</b><small className="muted-sm">{s.code} · {s.phoneMasked}</small></div>
                </div>
              ),
            },
            { header: 'Journey', render: (s) => <StatusBadge status={s.journey} /> },
            { header: 'Khóa học', render: (s) => s.course },
            { header: 'Sale', render: (s) => s.sale },
            { header: 'Tiến độ', render: (s) => (s.progress == null ? '—' : `${s.progress}%`) },
            { header: 'Thanh toán', render: (s) => s.payment },
            { header: 'Follow-up', render: (s) => (s.followUpOverdue ? <span className="danger">{s.followUp}</span> : s.followUp) },
            { header: '', render: (s) => <button className="btn secondary" onClick={() => navigate(`/students/${s.code}`)}>Mở</button> },
          ]}
        />
      </div>
    </section>
  )
}

const DETAIL_TABS = ['Tổng quan', 'Timeline', 'Tư vấn', 'Học tập', 'Thanh toán']

export function StudentDetailPage() {
  const { code = '' } = useParams()
  const { data: s, loading } = useData(() => api.getStudent(code), [code])
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState(DETAIL_TABS[0])

  if (loading) return null
  if (!s)
    return (
      <div className="card empty">
        Không tìm thấy học viên <b>{code}</b>. <Link to="/students">← Danh sách học viên</Link>
      </div>
    )

  return (
    <section>
      <div className="pagehead">
        <div><button className="btn secondary" onClick={() => navigate('/students')}>← Danh sách học viên</button></div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('Đã tạo task follow-up')}>＋ Tạo task</button>
          <button className="btn" onClick={() => toast('Đã mở form cập nhật')}>Chỉnh sửa hồ sơ</button>
        </div>
      </div>
      <div className="student-layout">
        <div>
          <div className="card profile-card">
            <div className="profile-head">
              <div className="bigavatar">{s.initials}</div>
              <div>
                <h2>{s.name}</h2>
                <div className="meta">{s.code} · {s.phoneMasked} · {s.email}</div>
                <div style={{ marginTop: 7, display: 'flex', gap: 4 }}>
                  <StatusBadge status={s.journey} />
                  <Badge tone="gray">{s.source}</Badge>
                  <Badge tone="blue">Sale: {s.sale}</Badge>
                </div>
              </div>
              <div className="status"><button className="btn soft" onClick={() => toast('Đã ghi nhận trạng thái')}>Cập nhật trạng thái</button></div>
            </div>
            <div className="journey">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step} className={`jstep ${i < s.journeyStep ? 'done' : i === s.journeyStep ? 'current' : ''}`}>{step}</div>
              ))}
            </div>
            <div className="info-grid">
              {s.info.map((x) => (
                <div className="info" key={x.label}><small>{x.label}</small><strong>{x.value}</strong></div>
              ))}
            </div>
            <div className="tabs">
              {DETAIL_TABS.map((t) => (
                <button key={t} className={`tab ${t === tab ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="two-col" style={{ marginTop: 14 }}>
            <div className="card pad">
              <div className="sect-title">Timeline hành trình</div>
              <div className="timeline">
                {s.timeline.map((e) => (
                  <div className="event" key={e.date + e.title}><b>{e.date} · {e.title}</b><p>{e.note}</p></div>
                ))}
              </div>
            </div>
            <div className="card pad">
              <div className="sect-title">Tiến độ học tập</div>
              {s.learning.length === 0 && <p className="subtitle">Chưa vào lớp.</p>}
              {s.learning.map((l) => (
                <div key={l.label}>
                  <p style={{ fontSize: 11, color: '#667085' }}>{l.label}</p>
                  <ProgressBar percent={l.percent} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0 14px', fontSize: 11 }}>
                    <b>{l.percent}%</b><span className={l.noteClass}>{l.note}</span>
                  </div>
                </div>
              ))}
              <button className="btn secondary" style={{ width: '100%' }} onClick={() => navigate('/progress')}>Xem chi tiết học tập</button>
            </div>
          </div>
        </div>

        <div className="side-stack">
          <div className="card pad">
            <div className="sect-title">Người phụ trách</div>
            {s.owners.map((o) => <p key={o.role}><b>{o.role}:</b> {o.name}</p>)}
            <hr style={{ border: 0, borderTop: '1px solid var(--line)' }} />
            <small style={{ color: '#667085' }}>Lần tương tác cuối</small>
            <p style={{ marginBottom: 0 }}><b>{s.lastTouch.time}</b><br /><span style={{ color: '#667085', fontSize: 11 }}>{s.lastTouch.channel}</span></p>
          </div>
          <div className="card pad">
            <div className="sect-title">Tài chính</div>
            <div className="money">{s.finance.amount}</div>
            <div className="subtitle">{s.finance.note}</div>
            <div style={{ marginTop: 14 }}><StatusBadge status={s.finance.badge} /></div>
            <button className="btn secondary" style={{ width: '100%', marginTop: 14 }} onClick={() => navigate('/transactions')}>Xem giao dịch</button>
          </div>
          {s.nextOpportunity && (
            <div className="card pad">
              <div className="sect-title">Cơ hội tiếp theo</div>
              <b>{s.nextOpportunity.course}</b>
              <p className="subtitle">{s.nextOpportunity.note}</p>
              <button className="btn soft" style={{ width: '100%' }} onClick={() => toast(`Đã tạo cơ hội ${s.nextOpportunity?.course} demo`)}>＋ Tạo cơ hội upsell</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
