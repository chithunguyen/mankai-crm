import type { Debt, Kpi, Transaction } from '../../types'

export const financeKpis: Kpi[] = [
  { label: 'Doanh thu tháng', value: '1.84B', meta: '+16.2%', metaClass: 'up' },
  { label: 'Đã thu', value: '1.62B', meta: '88.0% doanh thu' },
  { label: 'Phải thu', value: '428M', meta: '37M quá hạn', metaClass: 'warn' },
  { label: 'Giao dịch hôm nay', value: '18', meta: '16 đã đối soát' },
]

export const debts: Debt[] = [
  { name: 'Trần Nhật Nam', course: 'N1', value: '11.9M', paid: '8.1M', remaining: '3.8M', due: '22/09', overdue: true, owner: 'Lan Anh', status: { label: 'Quá hạn', tone: 'red' } },
  { name: 'Vũ Mai Anh', course: 'N2', value: '6.99M', paid: '4M', remaining: '2.99M', due: '28/09', owner: 'Chi', status: { label: 'Sắp đến hạn', tone: 'orange' } },
]

export const transactions: Transaction[] = [
  { time: '23/09 09:18', code: 'GD-0923-018', student: 'Trần Nhật Nam', content: 'Đợt 2 · N1', amount: 3_000_000, type: 'Thu học phí', method: 'Chuyển khoản', recordedBy: 'Lan', reconciled: true },
  { time: '23/09 08:42', code: 'GD-0923-011', student: 'Nguyễn Minh Anh', content: 'Thanh toán đủ · N2', amount: 6_990_000, type: 'Thu học phí', method: 'Chuyển khoản', recordedBy: 'Lan', reconciled: true },
  { time: '23/09 08:20', code: 'GD-0923-006', student: 'Vũ Mai Anh', content: 'Đợt 1 · N2', amount: 4_000_000, type: 'Thu học phí', method: 'Chuyển khoản', recordedBy: 'Lan', reconciled: false },
]
