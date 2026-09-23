// Lớp truy cập dữ liệu. Hiện trả về dữ liệu demo trong src/data/mock.
// Khi có backend (vd. Supabase), chỉ cần thay phần thân các hàm dưới đây —
// các trang UI gọi qua `api.*` nên không phải sửa.

import { auditLogs, automations, journeyRules, roles } from '../data/mock/admin'
import { dashboard } from '../data/mock/dashboard'
import { debts, financeKpis, transactions } from '../data/mock/finance'
import { checklist, classCapacity, classes, opsCards, resultKpis, schedule, taskKpis, tasks } from '../data/mock/operations'
import { leads, pipeline, salesKpis, sources } from '../data/mock/sales'
import { examResults, learningProgress, studentDetails, students } from '../data/mock/students'

const ok = <T,>(data: T): Promise<T> => Promise.resolve(structuredClone(data))

export const api = {
  getDashboard: () => ok(dashboard),

  listStudents: () => ok(students),
  getStudent: (code: string) => {
    const student = students.find((s) => s.code === code)
    const detail = studentDetails[code]
    return ok(student && detail ? { ...student, ...detail } : null)
  },
  listLearningProgress: () => ok(learningProgress),
  listExamResults: () => ok({ kpis: resultKpis, results: examResults }),

  getSales: () => ok({ kpis: salesKpis, leads }),
  getPipeline: () => ok(pipeline),
  listSources: () => ok(sources),

  getTasks: () => ok({ kpis: taskKpis, tasks }),
  listChecklist: () => ok(checklist),
  getClasses: () => ok({ classes, schedule, capacity: classCapacity }),
  listOpsCards: () => ok(opsCards),

  getFinance: () => ok({ kpis: financeKpis, debts }),
  listTransactions: () => ok(transactions),

  listRoles: () => ok(roles),
  listAuditLogs: () => ok(auditLogs),
  getSettings: () => ok({ automations, journeyRules }),
}
