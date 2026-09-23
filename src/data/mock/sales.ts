import type { Kpi, Lead, PipelineStage, SourceStat } from '../../types'

export const salesKpis: Kpi[] = [
  { label: 'Data mới hôm nay', value: '234', meta: '190 đã nhận · 44 chờ', metaClass: 'up' },
  { label: 'Đã kết nối', value: '56.8%', meta: '108 / 190 data đã nhận' },
  { label: 'Hot lead', value: '128', meta: '32 quá SLA', metaClass: 'warn' },
  { label: 'Đã đăng ký', value: '18.6%', meta: 'Theo phễu hiện tại', metaClass: 'up' },
]

export const leads: Lead[] = [
  { name: 'Phạm Hoàng Long', source: 'Facebook', createdAt: '23/09', sale: 'Chi', status: { label: 'HOT LEAD', tone: 'orange' }, lastTouch: '10:25', nextAction: 'Follow ngay', nextActionUrgent: true, value: '7.9M' },
  { name: 'Nguyễn Mai Linh', source: 'Website', createdAt: '22/09', sale: 'Lan Anh', status: { label: 'TƯ VẤN', tone: 'blue' }, lastTouch: '09:12', nextAction: '25/09', value: '6.99M' },
  { name: 'Đỗ Minh Đức', source: 'Free Class', createdAt: '21/09', sale: 'Chi', status: { label: 'ĐÃ ĐĂNG KÝ', tone: 'green' }, lastTouch: '20/09', nextAction: 'Chăm sóc sau sale', value: '10.99M' },
  { name: 'Lê Thu Hà', source: 'Referral', createdAt: '20/09', sale: 'Lan Anh', status: { label: 'CHƯA KẾT NỐI', tone: 'gray' }, lastTouch: '—', nextAction: 'Hôm nay', value: '7.9M' },
]

export const pipeline: PipelineStage[] = [
  { name: 'Data mới', count: 48, tone: 'gray', cards: [
    { name: 'Nguyễn Mai Linh', note: 'Website · quan tâm N2', sale: 'Lan Anh', value: '6.99M' },
    { name: 'Lê Thu Hà', note: 'Referral · hỏi lịch học', sale: 'Chi', value: '7.9M' },
  ] },
  { name: 'Đã kết nối', count: 31, tone: 'blue', cards: [
    { name: 'Trần Minh Khoa', note: 'Zalo · phản hồi tốt', sale: 'Chi', value: '6.99M' },
  ] },
  { name: 'Tư vấn', count: 24, tone: 'blue', cards: [
    { name: 'Nguyễn Thảo Vy', note: 'Đang so sánh N2/N1', sale: 'Lan Anh', value: '7.9M' },
    { name: 'Đặng Quốc Anh', note: 'Cần tư vấn lộ trình', sale: 'Chi', value: '10.99M' },
  ] },
  { name: 'Hot lead', count: 18, tone: 'orange', cards: [
    { name: 'Phạm Hoàng Long', note: 'Muốn KG sớm · đã hỏi học phí', sale: 'Chi', value: '7.9M' },
    { name: 'Vũ Mai Anh', note: 'Đã xem offer · cần follow', sale: 'Lan Anh', value: '6.99M' },
  ] },
  { name: 'Đăng ký', count: 11, tone: 'green', cards: [
    { name: 'Đỗ Minh Đức', note: 'N2 · chờ đối soát', sale: 'Chi', value: '10.99M' },
  ] },
  { name: 'Đã thanh toán', count: 8, tone: 'green', cards: [
    { name: 'Nguyễn Minh Anh', note: 'N2 · đã thu đủ', sale: 'Chi', value: '6.99M' },
  ] },
]

export const sources: SourceStat[] = [
  { source: 'Facebook Ads', data: 620, connected: '58%', consulting: '41%', hot: '18%', registered: '12.4%', revenue: '628M' },
  { source: 'Free Class', data: 280, connected: '67%', consulting: '52%', hot: '24%', registered: '19.1%', revenue: '392M' },
  { source: 'Website', data: 190, connected: '62%', consulting: '48%', hot: '21%', registered: '16.8%', revenue: '286M' },
  { source: 'Referral', data: 116, connected: '81%', consulting: '63%', hot: '31%', registered: '28.4%', revenue: '334M' },
  { source: 'Data cũ', data: 80, connected: '44%', consulting: '28%', hot: '12%', registered: '7.5%', revenue: '200M' },
]
