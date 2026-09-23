import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { KpiGrid, PageHeader, TaskList } from '../components/ui'
import { useToast } from '../components/ui/Toast'
import { useData } from '../hooks/useData'
import { useModal } from '../modals/ModalProvider'
import { api } from '../services/api'
import type { Task } from '../types'

/** Giữ danh sách task trong state để có thể tick hoàn thành (chưa lưu về server). */
function useToggleableTasks(source: Task[] | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => setTasks(source ?? []), [source])
  const toggle = (id: string) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  return [tasks, toggle] as const
}

export function TasksPage() {
  const { data } = useData(api.getTasks)
  const [tasks, toggle] = useToggleableTasks(data?.tasks)
  const openModal = useModal()
  if (!data) return null

  return (
    <section>
      <PageHeader
        title="Công việc & nhắc việc"
        subtitle="Task cá nhân, task theo phòng ban và nhắc việc tự động"
        actions={<button className="btn" onClick={() => openModal('task')}>＋ Tạo công việc</button>}
      />
      <KpiGrid kpis={data.kpis} columns={4} />
      <div className="card pad" style={{ marginTop: 14 }}>
        <TaskList tasks={tasks} onToggle={toggle} />
      </div>
    </section>
  )
}

export function OperationsPage() {
  const { data: cards = [] } = useData(api.listOpsCards)
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <section>
      <PageHeader title="Trung tâm vận hành" subtitle="Điều phối data · lead nóng · lớp · khai giảng · cảnh báo liên phòng ban" />
      <div className="ops-grid">
        {cards.map((c) => (
          <div className="card opcard" key={c.title}>
            <h3>{c.title}</h3>
            <p>{c.note}</p>
            <button className="btn secondary" style={{ width: '100%' }} onClick={() => (c.to ? navigate(c.to) : toast(c.toast ?? c.action))}>
              {c.action}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ChecklistPage() {
  const { data } = useData(api.listChecklist)
  const [tasks, toggle] = useToggleableTasks(data)
  const openModal = useModal()

  return (
    <section>
      <PageHeader
        title="Checklist vận hành"
        subtitle="Chuẩn hóa công việc lặp lại theo ca/ngày/tuần"
        actions={<button className="btn" onClick={() => openModal('task')}>＋ Thêm checklist</button>}
      />
      <div className="card pad">
        <TaskList tasks={tasks} onToggle={toggle} />
      </div>
    </section>
  )
}
