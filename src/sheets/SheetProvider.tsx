import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { fetchSpreadsheet, fetchUser, GoogleApiError, loadGis, requestAccessToken, revokeToken, type GoogleUser } from './google'
import { parseSheet, type SheetDB } from './parse'
import { TABS } from './schema'

const REFRESH_MS = 5 * 60 * 1000
const LS = { mode: 'mk.mode', sheetId: 'mk.sheetId', clientId: 'mk.clientId' }
const SS_SESSION = 'mk.googleSession'

const storage = {
  get(store: Storage, key: string) {
    try {
      return store.getItem(key)
    } catch {
      return null
    }
  },
  set(store: Storage, key: string, value: string | null) {
    try {
      if (value == null) store.removeItem(key)
      else store.setItem(key, value)
    } catch {
      /* trình duyệt chặn storage — bỏ qua */
    }
  },
}

interface Session {
  token: string
  expiresAt: number
  user?: GoogleUser
}

export type Mode = 'demo' | 'sheet'

export interface SheetState {
  mode: Mode
  /** Client ID lấy từ biến môi trường lúc build (không cho sửa trên giao diện) */
  envClientId: boolean
  clientId: string
  sheetId: string
  session: Session | null
  loading: boolean
  error?: string
  problems: string[]
  db?: SheetDB
  title?: string
  loadedAt?: number
}

interface SheetContextValue extends SheetState {
  sessionValid: boolean
  connect: () => Promise<void>
  refresh: () => Promise<void>
  signOut: () => void
  setMode: (m: Mode) => void
  saveConfig: (c: { clientId?: string; sheetId?: string }) => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

export function useSheet() {
  const ctx = useContext(SheetContext)
  if (!ctx) throw new Error('useSheet phải nằm trong <SheetProvider>')
  return ctx
}

const ENV_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? ''
const ENV_SHEET_ID = (import.meta.env.VITE_SHEET_ID as string | undefined)?.trim() ?? ''
const WANTED_TABS = Object.values(TABS).map((t) => t.sheet)

function readSession(): Session | null {
  try {
    const s = JSON.parse(storage.get(sessionStorage, SS_SESSION) ?? 'null') as Session | null
    return s && s.expiresAt > Date.now() ? s : null
  } catch {
    return null
  }
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SheetState>(() => {
    const clientId = ENV_CLIENT_ID || storage.get(localStorage, LS.clientId) || ''
    const sheetId = storage.get(localStorage, LS.sheetId) || ENV_SHEET_ID
    const savedMode = storage.get(localStorage, LS.mode) as Mode | null
    return {
      mode: savedMode ?? (clientId && sheetId ? 'sheet' : 'demo'),
      envClientId: !!ENV_CLIENT_ID,
      clientId,
      sheetId,
      session: readSession(),
      loading: false,
      problems: [],
    }
  })
  const stateRef = useRef(state)
  stateRef.current = state

  const patch = (p: Partial<SheetState>) => setState((s) => ({ ...s, ...p }))

  const setSession = (session: Session | null) => {
    storage.set(sessionStorage, SS_SESSION, session && JSON.stringify(session))
    patch({ session })
  }

  const load = useCallback(async (session: Session) => {
    const { sheetId } = stateRef.current
    if (!sheetId) return patch({ error: 'Chưa nhập link Google Sheet.' })
    patch({ loading: true, error: undefined })
    try {
      const { title, tabs } = await fetchSpreadsheet(sheetId, session.token, WANTED_TABS)
      const { db, problems } = parseSheet(tabs)
      patch({ loading: false, title, problems, db: problems.length ? undefined : db, loadedAt: Date.now() })
    } catch (e) {
      if (e instanceof GoogleApiError && e.reauth) setSession(null)
      patch({ loading: false, error: (e as Error).message })
    }
  }, [])

  const connect = useCallback(async () => {
    const { clientId } = stateRef.current
    if (!clientId) return patch({ error: 'Chưa cấu hình Google OAuth Client ID.' })
    patch({ error: undefined })
    try {
      const { token, expiresAt } = await requestAccessToken(clientId)
      const user = await fetchUser(token).catch(() => undefined)
      const session = { token, expiresAt, user }
      setSession(session)
      storage.set(localStorage, LS.mode, 'sheet')
      patch({ mode: 'sheet' })
      await load(session)
    } catch (e) {
      patch({ error: (e as Error).message })
    }
  }, [load])

  const refresh = useCallback(async () => {
    const s = readSession()
    if (!s) {
      setSession(null)
      return patch({ error: 'Phiên đăng nhập đã hết hạn.' })
    }
    await load(s)
  }, [load])

  const signOut = useCallback(() => {
    const s = stateRef.current.session
    if (s) revokeToken(s.token)
    setSession(null)
    patch({ db: undefined, title: undefined, loadedAt: undefined, problems: [], error: undefined })
  }, [])

  const setMode = useCallback((mode: Mode) => {
    storage.set(localStorage, LS.mode, mode)
    patch({ mode, error: undefined })
  }, [])

  const saveConfig = useCallback((c: { clientId?: string; sheetId?: string }) => {
    if (c.clientId !== undefined && !ENV_CLIENT_ID) storage.set(localStorage, LS.clientId, c.clientId || null)
    if (c.sheetId !== undefined) storage.set(localStorage, LS.sheetId, c.sheetId || null)
    const s = stateRef.current
    const next = {
      ...s,
      clientId: ENV_CLIENT_ID || (c.clientId ?? s.clientId),
      sheetId: c.sheetId ?? s.sheetId,
      db: c.sheetId !== undefined && c.sheetId !== s.sheetId ? undefined : s.db,
    }
    // cập nhật ref ngay để connect()/refresh() gọi liền sau dùng cấu hình mới
    stateRef.current = next
    setState(next)
  }, [])

  // Chế độ Sheet: tải sẵn thư viện đăng nhập (để popup không bị chặn) và tự tải dữ liệu nếu còn phiên.
  useEffect(() => {
    if (state.mode !== 'sheet') return
    loadGis().catch(() => {})
    const s = readSession()
    if (s && !stateRef.current.db && !stateRef.current.loading) load(s)
  }, [state.mode, load])

  // Tự làm mới mỗi 5 phút khi tab đang mở và phiên còn hạn.
  useEffect(() => {
    if (state.mode !== 'sheet' || !state.db) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible' && readSession()) load(readSession()!)
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [state.mode, state.db, load])

  const sessionValid = !!state.session && state.session.expiresAt > Date.now()

  return (
    <SheetContext.Provider value={{ ...state, sessionValid, connect, refresh, signOut, setMode, saveConfig }}>{children}</SheetContext.Provider>
  )
}
