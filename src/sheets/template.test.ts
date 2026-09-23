// Bảo đảm file mẫu public/mankai-crm-template.xlsx luôn khớp cấu trúc mà code đọc.
import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'
import { computeDashboard } from './compute'
import { parseSheet, type Cell } from './parse'

const DAY = 86400000

async function readTemplate() {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(new URL('../../public/mankai-crm-template.xlsx', import.meta.url).pathname)
  const tabs: Record<string, Cell[][]> = {}
  wb.eachSheet((ws) => {
    const rows: Cell[][] = []
    ws.eachRow({ includeEmpty: false }, (row) => {
      const values = (row.values as unknown[]).slice(1)
      // Giả lập Sheets API: ngày → serial number
      rows.push(values.map((v) => (v instanceof Date ? (v.getTime() - Date.UTC(1899, 11, 30)) / DAY : (v as Cell))))
    })
    tabs[ws.name] = rows
  })
  return tabs
}

describe('file Sheet mẫu', () => {
  it('đúng cấu trúc và tính được dashboard', async () => {
    const { db, problems } = parseSheet(await readTemplate())
    expect(problems).toEqual([])
    expect(db.leads.length).toBeGreaterThan(100)
    expect(db.leads.every((l) => l.createdAt && l.followUp)).toBe(true)
    expect(db.enrollments.every((e) => e.value && e.date && e.due)).toBe(true)

    const d = computeDashboard(db, new Date())
    expect(d.kpis).toHaveLength(5)
    expect(d.funnel[0].percent).toBe(100)
  })
})
