import type { ExamResult, LearningProgress, Student, StudentDetail } from '../../types'

export const JOURNEY_STEPS = ['Lead', 'Kết nối', 'Tư vấn', 'Hot', 'Đăng ký', 'Thanh toán', 'Đang học', 'Kết quả', 'Học tiếp']

export const students: Student[] = [
  {
    code: 'MK-2026-01842', name: 'Nguyễn Minh Anh', initials: 'MA', phoneMasked: '0988***',
    journey: { label: 'ĐANG HỌC', tone: 'green' }, course: 'N2 Chuyên sâu', courseLevel: 'N2', sale: 'Chi',
    progress: 72, payment: '6.99M / đủ', followUp: 'Hôm nay',
  },
  {
    code: 'MK-2026-01921', name: 'Phạm Hoàng Long', initials: 'PL', phoneMasked: '0912***',
    journey: { label: 'HOT LEAD', tone: 'orange' }, course: 'N1', courseLevel: 'N1', sale: 'Chi',
    progress: null, payment: 'Chưa thu', followUp: 'Quá hạn 1 ngày', followUpOverdue: true,
  },
  {
    code: 'MK-2026-01711', name: 'Trần Nhật Nam', initials: 'LN', phoneMasked: '0904***',
    journey: { label: 'CẦN CS', tone: 'red' }, course: 'N1 Chuyên sâu', courseLevel: 'N1', sale: 'Lan Anh',
    progress: 49, payment: '8.1M / 11.9M', followUp: '26/09',
  },
]

export const studentDetails: Record<string, StudentDetail> = {
  'MK-2026-01842': {
    code: 'MK-2026-01842',
    email: 'minh.anh@email.demo',
    source: 'Facebook',
    journeyStep: 6,
    info: [
      { label: 'Khóa hiện tại', value: 'N2 Chuyên sâu' },
      { label: 'Lớp', value: 'N2-09' },
      { label: 'Ngày KG', value: '25/09/2026' },
      { label: 'Giá trị khóa', value: '6.990.000đ' },
      { label: 'Attendance', value: '94%' },
      { label: 'LMS', value: '78%' },
      { label: 'Điểm gần nhất', value: '112/180' },
      { label: 'Công nợ', value: '0đ' },
    ],
    timeline: [
      { date: '25/09', title: 'Khai giảng', note: 'Đã tham gia buổi học đầu tiên · Đào tạo' },
      { date: '20/09', title: 'Hoàn tất thanh toán', note: 'Thu đủ 6.990.000đ · Kế toán' },
      { date: '18/09', title: 'Đăng ký N2', note: 'Sale xác nhận nhu cầu và chốt khóa' },
      { date: '16/09', title: 'Hot lead', note: 'Đã tư vấn lộ trình và follow-up' },
      { date: '12/09', title: 'Kết nối Zalo', note: 'Lead phản hồi tin nhắn đầu tiên' },
      { date: '10/09', title: 'Data mới', note: 'Nguồn Facebook · chiến dịch JLPT' },
    ],
    learning: [
      { label: 'Tiến độ chương trình', percent: 72, note: '+8% tuần này', noteClass: 'up' },
      { label: 'Attendance', percent: 94, note: '16/17 buổi' },
      { label: 'Bài tập', percent: 88, note: '22/25 bài' },
    ],
    owners: [
      { role: 'Sale', name: 'Chi' },
      { role: 'Đào tạo', name: 'Thùy ss' },
      { role: 'Vận hành', name: 'Hương' },
      { role: 'Kế toán', name: 'Lan' },
    ],
    lastTouch: { time: '23/09 · 10:14', channel: 'Zalo · Sale Chi' },
    finance: { amount: '6.990.000đ', note: 'Đã thanh toán 100%', badge: { label: 'Không công nợ', tone: 'green' } },
    nextOpportunity: { course: 'JLPT N1', note: 'Có thể tư vấn lộ trình sau N2.' },
  },
  'MK-2026-01711': {
    code: 'MK-2026-01711',
    email: 'nhat.nam@email.demo',
    source: 'Website',
    journeyStep: 6,
    info: [
      { label: 'Khóa hiện tại', value: 'N1 Chuyên sâu' },
      { label: 'Lớp', value: 'N1-05' },
      { label: 'Ngày KG', value: '18/09/2026' },
      { label: 'Giá trị khóa', value: '11.900.000đ' },
      { label: 'Attendance', value: '68%' },
      { label: 'LMS', value: '42%' },
      { label: 'Điểm gần nhất', value: '86/180' },
      { label: 'Công nợ', value: '3.800.000đ' },
    ],
    timeline: [
      { date: '23/09', title: 'Thu đợt 2', note: 'Thu 3.000.000đ · Kế toán' },
      { date: '18/09', title: 'Khai giảng', note: 'Vào lớp N1-05 · Đào tạo' },
      { date: '10/09', title: 'Đăng ký N1', note: 'Thanh toán đợt 1 · Sale Lan Anh' },
    ],
    learning: [
      { label: 'Tiến độ chương trình', percent: 49, note: 'Chậm hơn lớp', noteClass: 'danger' },
      { label: 'Attendance', percent: 68, note: '11/16 buổi' },
      { label: 'Bài tập', percent: 55, note: '11/20 bài' },
    ],
    owners: [
      { role: 'Sale', name: 'Lan Anh' },
      { role: 'Đào tạo', name: 'Thùy ss' },
      { role: 'Vận hành', name: 'Hương' },
      { role: 'Kế toán', name: 'Lan' },
    ],
    lastTouch: { time: '22/09 · 16:40', channel: 'Gọi điện · Sale Lan Anh' },
    finance: { amount: '8.100.000đ', note: 'Đã thanh toán 68% · còn 3.8M', badge: { label: 'Quá hạn 22/09', tone: 'red' } },
    nextOpportunity: null,
  },
  'MK-2026-01921': {
    code: 'MK-2026-01921',
    email: 'hoang.long@email.demo',
    source: 'Facebook',
    journeyStep: 3,
    info: [
      { label: 'Khóa quan tâm', value: 'N1' },
      { label: 'Lớp', value: '—' },
      { label: 'Ngày KG', value: '—' },
      { label: 'Giá trị dự kiến', value: '7.900.000đ' },
      { label: 'Attendance', value: '—' },
      { label: 'LMS', value: '—' },
      { label: 'Điểm gần nhất', value: '—' },
      { label: 'Công nợ', value: '—' },
    ],
    timeline: [
      { date: '23/09', title: 'Hot lead', note: 'Muốn KG sớm · đã hỏi học phí' },
      { date: '22/09', title: 'Tư vấn', note: 'Gọi tư vấn lộ trình N1 · Sale Chi' },
      { date: '21/09', title: 'Data mới', note: 'Nguồn Facebook' },
    ],
    learning: [],
    owners: [
      { role: 'Sale', name: 'Chi' },
      { role: 'Vận hành', name: 'Hương' },
    ],
    lastTouch: { time: '23/09 · 10:25', channel: 'Zalo · Sale Chi' },
    finance: { amount: '0đ', note: 'Chưa thanh toán', badge: { label: 'Chưa thu', tone: 'gray' } },
    nextOpportunity: { course: 'N1 Chuyên sâu', note: 'Follow-up chốt khóa trước 17:00.' },
  },
}

export const learningProgress: LearningProgress[] = [
  { code: 'MK-2026-01842', name: 'Nguyễn Minh Anh', classCode: 'N2-09', attendance: 94, homework: 88, lms: 78, progress: 72, warning: { label: 'ỔN', tone: 'green' } },
  { code: 'MK-2026-01711', name: 'Trần Nhật Nam', classCode: 'N1-05', attendance: 68, homework: 55, lms: 42, progress: 49, warning: { label: 'CẦN CS', tone: 'red' } },
  { code: 'MK-2026-01750', name: 'Mai Thu Trang', classCode: 'N3-12', attendance: 82, homework: 74, lms: 70, progress: 66, warning: { label: 'THEO DÕI', tone: 'orange' } },
]

export const examResults: ExamResult[] = [
  { name: 'Nguyễn Minh Anh', course: 'N2', latest: '112/180', target: '120+', change: 9, status: { label: 'Tiến bộ', tone: 'green' }, nextAction: 'Tư vấn luyện đề' },
  { name: 'Trần Nhật Nam', course: 'N1', latest: '86/180', target: '100+', change: -4, status: { label: 'Cảnh báo', tone: 'red' }, nextAction: 'CS học tập' },
]
