import { useState } from 'react'
import { extractSheetId } from './google'
import { useSheet } from './SheetProvider'

export const TEMPLATE_URL = './mankai-crm-template.xlsx'
export const GUIDE_URL = 'https://github.com/chithunguyen/mankai-crm/blob/main/docs/HUONG-DAN-GOOGLE-SHEET.md'

const time = (ms: number) => new Date(ms).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

/** Thanh nhỏ cho biết đang xem dữ liệu nào, kèm nút làm mới / đăng xuất / chuyển chế độ. */
export function SourceBar({ onConfigure }: { onConfigure: () => void }) {
  const s = useSheet()

  if (s.mode === 'demo') {
    return (
      <div className="sourcebar">
        <span className="srcdot demo" />
        <span>Đang xem <b>dữ liệu demo</b></span>
        <span className="spacer" />
        <button className="linkbtn" onClick={() => s.setMode('sheet')}>Kết nối Google Sheet →</button>
      </div>
    )
  }

  if (!s.db) return null

  return (
    <div className="sourcebar">
      <span className={`srcdot ${s.sessionValid ? 'live' : 'stale'}`} />
      <span>
        Google Sheet <b>{s.title}</b>
        {s.loadedAt && <> · cập nhật lúc {time(s.loadedAt)}</>}
        {s.session?.user && <> · {s.session.user.email}</>}
      </span>
      {s.error && <span className="danger">{s.error}</span>}
      <span className="spacer" />
      {s.sessionValid ? (
        <button className="linkbtn" onClick={s.refresh} disabled={s.loading}>{s.loading ? 'Đang tải…' : '↻ Làm mới'}</button>
      ) : (
        <button className="linkbtn" onClick={s.connect}>Đăng nhập lại</button>
      )}
      <button className="linkbtn muted" onClick={onConfigure}>Cấu hình</button>
      {s.sessionValid && <button className="linkbtn muted" onClick={s.signOut}>Đăng xuất</button>}
      <button className="linkbtn muted" onClick={() => s.setMode('demo')}>Xem demo</button>
    </div>
  )
}

/** Màn hình kết nối: nhập Client ID / link Sheet, đăng nhập Google, hiển thị lỗi cấu trúc Sheet. */
export function SheetConnectPanel({ onDone }: { onDone?: () => void }) {
  const s = useSheet()
  const [clientId, setClientId] = useState(s.clientId)
  const [sheetInput, setSheetInput] = useState(s.sheetId)

  const submit = async () => {
    const sheetId = extractSheetId(sheetInput)
    s.saveConfig({ clientId: clientId.trim(), sheetId })
    if (s.sessionValid && sheetId === s.sheetId) await s.refresh()
    else await s.connect()
    onDone?.()
  }

  return (
    <div className="card pad connect-panel">
      <div className="sect-title">Kết nối Google Sheet</div>
      <p className="subtitle">
        Đăng nhập bằng tài khoản Google <b>đã được chia sẻ quyền xem</b> file Sheet. Dữ liệu chỉ đọc, đi thẳng từ Google về trình duyệt của bạn.
      </p>

      <div className="formgrid" style={{ marginTop: 14 }}>
        {!s.envClientId && (
          <div className="field">
            <label htmlFor="clientId">Google OAuth Client ID</label>
            <input id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="xxxx.apps.googleusercontent.com" />
          </div>
        )}
        <div className="field">
          <label htmlFor="sheet">Link Google Sheet</label>
          <input id="sheet" value={sheetInput} onChange={(e) => setSheetInput(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." />
        </div>
      </div>

      {s.error && <div className="errorbox">{s.error}</div>}
      {s.problems.length > 0 && (
        <div className="errorbox">
          <b>File Sheet chưa đúng cấu trúc:</b>
          <ul>{s.problems.map((p) => <li key={p}>{p}</li>)}</ul>
          Đối chiếu với file mẫu bên dưới.
        </div>
      )}

      <div className="actions" style={{ marginTop: 16, flexWrap: 'wrap' }}>
        <button className="btn" onClick={submit} disabled={s.loading || !sheetInput.trim() || !(clientId.trim() || s.envClientId)}>
          {s.loading ? 'Đang tải dữ liệu…' : s.sessionValid ? 'Tải dữ liệu' : 'Đăng nhập Google & tải dữ liệu'}
        </button>
        {s.db && onDone && <button className="btn secondary" onClick={onDone}>Đóng</button>}
        <button className="btn secondary" onClick={() => s.setMode('demo')}>Xem dữ liệu demo</button>
      </div>

      <div className="connect-links">
        <a href={TEMPLATE_URL} download>↓ Tải file Sheet mẫu (.xlsx)</a>
        <a href={GUIDE_URL} target="_blank" rel="noreferrer">Hướng dẫn cài đặt ↗</a>
      </div>
    </div>
  )
}
