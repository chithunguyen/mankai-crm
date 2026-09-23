import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import logo from '../../assets/mankai-logo.png'
import { navigation } from '../../config/navigation'
import { useData } from '../../hooks/useData'
import { useModal } from '../../modals/ModalProvider'
import { api } from '../../services/api'
import { normalize } from '../../utils/format'
import { useToast } from '../ui/Toast'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="Mankai Academy" />
      </div>
      <div className="rolebox">
        <strong>● CEO · Toàn quyền</strong>
        <span>Không gian quản trị nội bộ</span>
      </div>
      <nav className="navgroup">
        {navigation.map((group) => (
          <div key={group.label}>
            <div className="navlabel">{group.label}</div>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `navbtn ${isActive ? 'active' : ''}`}>
                <span className="ico">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

function GlobalSearch() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { data: students = [] } = useData(api.listStudents)

  const nq = normalize(q)
  const matches = nq.length >= 2 ? students.filter((s) => normalize(`${s.name} ${s.code} ${s.sale} ${s.course}`).includes(nq)).slice(0, 6) : []

  const go = (code: string) => {
    setQ('')
    navigate(`/students/${code}`)
  }

  return (
    <div className="global-search">
      <span className="search-icon">⌕</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && matches[0] && go(matches[0].code)}
        placeholder="Tìm học viên, SĐT, Sale, lớp, mã HV..."
      />
      {nq.length >= 2 && (
        <div className="results">
          {matches.map((s) => (
            <button key={s.code} onClick={() => go(s.code)}>
              <span className="miniavatar">{s.initials}</span>
              <div>
                <b>{s.name}</b>
                <small>
                  {s.code} · {s.course} · Sale {s.sale}
                </small>
              </div>
            </button>
          ))}
          {matches.length === 0 && <div className="empty" style={{ padding: 14 }}>Không tìm thấy</div>}
        </div>
      )}
    </div>
  )
}

export function Layout() {
  const toast = useToast()
  const openModal = useModal()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <GlobalSearch />
          <div className="top-actions">
            <button className="iconbtn" onClick={() => toast('Bạn có 7 thông báo mới')} aria-label="Thông báo">
              🔔<span className="dot" />
            </button>
            <button className="iconbtn" onClick={() => openModal('quick')} aria-label="Tạo nhanh">
              ＋
            </button>
            <button className="profilebtn">
              <span>Nguyễn Thu Chi</span>
              <div className="avatar">C</div>
            </button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
