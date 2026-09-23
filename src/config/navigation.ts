export interface NavItem {
  to: string
  label: string
  icon: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      { to: '/', label: 'Dashboard', icon: '▦' },
      { to: '/students', label: 'Học viên 360°', icon: '◎' },
      { to: '/tasks', label: 'Công việc & nhắc việc', icon: '✓' },
    ],
  },
  {
    label: 'Kinh doanh',
    items: [
      { to: '/data', label: 'Data & Sale', icon: '◫' },
      { to: '/pipeline', label: 'Pipeline cơ hội', icon: '◇' },
      { to: '/sources', label: 'Nguồn Data', icon: '◌' },
    ],
  },
  {
    label: 'Đào tạo',
    items: [
      { to: '/classes', label: 'Lớp học & lịch', icon: '▤' },
      { to: '/progress', label: 'Tiến độ học tập', icon: '◒' },
      { to: '/results', label: 'Kết quả & JLPT', icon: '★' },
    ],
  },
  {
    label: 'Vận hành',
    items: [
      { to: '/operations', label: 'Trung tâm vận hành', icon: '⚙' },
      { to: '/checklist', label: 'Checklist vận hành', icon: '☑' },
    ],
  },
  {
    label: 'Tài chính',
    items: [
      { to: '/finance', label: 'Kế toán & công nợ', icon: '₫' },
      { to: '/transactions', label: 'Giao dịch', icon: '⇄' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { to: '/permissions', label: 'Phân quyền', icon: '♙' },
      { to: '/logs', label: 'Audit log', icon: '◷' },
      { to: '/settings', label: 'Cài đặt', icon: '⚙' },
    ],
  },
]
