import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { ToastProvider } from './components/ui/Toast'
import { ModalProvider } from './modals/ModalProvider'
import { SheetProvider } from './sheets/SheetProvider'
import { AuditLogPage, PermissionsPage, SettingsPage } from './pages/Admin'
import { DashboardPage } from './pages/Dashboard'
import { FinancePage, TransactionsPage } from './pages/Finance'
import { ChecklistPage, OperationsPage, TasksPage } from './pages/Operations'
import { DataSalePage, PipelinePage, SourcesPage } from './pages/Sales'
import { StudentDetailPage, StudentsPage } from './pages/Students'
import { ClassesPage, ProgressPage, ResultsPage } from './pages/Training'

// HashRouter (URL dạng /#/students) để GitHub Pages không trả 404 khi F5 ở trang con.
export default function App() {
  return (
    <HashRouter>
      <SheetProvider>
      <ToastProvider>
        <ModalProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="students/:code" element={<StudentDetailPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="data" element={<DataSalePage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="operations" element={<OperationsPage />} />
              <Route path="checklist" element={<ChecklistPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="permissions" element={<PermissionsPage />} />
              <Route path="logs" element={<AuditLogPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ModalProvider>
      </ToastProvider>
      </SheetProvider>
    </HashRouter>
  )
}
