// Đăng nhập Google (Google Identity Services — token client) và đọc Sheet qua Sheets API v4.
// Không cần backend: access token nằm trong trình duyệt, Google tự kiểm tra người dùng có quyền xem Sheet.

import { normalize } from '../utils/format'
import type { Cell } from './parse'

const GIS_SRC = 'https://accounts.google.com/gsi/client'
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly openid email profile'

interface TokenResponse {
  access_token: string
  expires_in: number
  error?: string
  error_description?: string
}

interface TokenClient {
  requestAccessToken(opts?: { prompt?: string }): void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(cfg: {
            client_id: string
            scope: string
            callback: (r: TokenResponse) => void
            error_callback?: (e: { type: string; message?: string }) => void
          }): TokenClient
          revoke(token: string, done?: () => void): void
        }
      }
    }
  }
}

let gisLoading: Promise<void> | undefined

export function loadGis(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve()
  gisLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = GIS_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      gisLoading = undefined
      reject(new Error('Không tải được thư viện đăng nhập Google (kiểm tra mạng / trình chặn quảng cáo).'))
    }
    document.head.appendChild(s)
  })
  return gisLoading
}

let client: { id: string; tc: TokenClient } | undefined
let pending: { resolve: (r: TokenResponse) => void; reject: (e: Error) => void } | undefined

const POPUP_ERRORS: Record<string, string> = {
  popup_closed: 'Bạn đã đóng cửa sổ đăng nhập.',
  popup_failed_to_open: 'Trình duyệt chặn cửa sổ đăng nhập — cho phép popup rồi thử lại.',
}

/**
 * Mở cửa sổ đăng nhập Google và trả về access token.
 * Gọi trực tiếp trong sự kiện click (sau khi loadGis() xong) để không bị chặn popup.
 */
export async function requestAccessToken(clientId: string): Promise<{ token: string; expiresAt: number }> {
  await loadGis()
  if (client?.id !== clientId) {
    const tc = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (r) => (r.error ? pending?.reject(new Error(r.error_description || r.error)) : pending?.resolve(r)),
      error_callback: (e) => pending?.reject(new Error(POPUP_ERRORS[e.type] ?? e.message ?? e.type)),
    })
    client = { id: clientId, tc }
  }
  const r = await new Promise<TokenResponse>((resolve, reject) => {
    pending = { resolve, reject }
    client!.tc.requestAccessToken({ prompt: '' })
  })
  // trừ 60s để làm mới trước khi token thực sự hết hạn
  return { token: r.access_token, expiresAt: Date.now() + (r.expires_in - 60) * 1000 }
}

export function revokeToken(token: string) {
  window.google?.accounts.oauth2.revoke(token)
}

export class GoogleApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function gfetch<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (res.ok) return res.json() as Promise<T>
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
  const detail = body.error?.message ?? ''
  const message =
    res.status === 401
      ? 'Phiên đăng nhập đã hết hạn.'
      : res.status === 403 && /has not been used|is disabled/i.test(detail)
        ? 'Google Sheets API chưa được bật trong Google Cloud project.'
        : res.status === 403
          ? 'Tài khoản này chưa được chia sẻ quyền xem Google Sheet.'
          : res.status === 404
            ? 'Không tìm thấy Google Sheet — kiểm tra lại link.'
            : `Lỗi Google API (${res.status}): ${detail}`
  throw new GoogleApiError(res.status, message)
}

export interface GoogleUser {
  name: string
  email: string
  picture?: string
}

export const fetchUser = (token: string) => gfetch<GoogleUser>('https://www.googleapis.com/oauth2/v3/userinfo', token)

/** Tải toàn bộ các tab cần thiết trong 2 request: metadata + batchGet. */
export async function fetchSpreadsheet(sheetId: string, token: string, wantedTabs: string[]) {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}`
  const meta = await gfetch<{ properties: { title: string }; sheets: { properties: { title: string } }[] }>(
    `${base}?fields=properties.title,sheets.properties.title`,
    token,
  )
  const titles = meta.sheets.map((s) => s.properties.title).filter((t) => wantedTabs.some((w) => normalize(w) === normalize(t)))

  const tabs: Record<string, Cell[][]> = {}
  if (titles.length) {
    const qs = titles.map((t) => `ranges=${encodeURIComponent(`'${t.replace(/'/g, "''")}'`)}`).join('&')
    const data = await gfetch<{ valueRanges: { values?: Cell[][] }[] }>(
      `${base}/values:batchGet?${qs}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER`,
      token,
    )
    titles.forEach((t, i) => (tabs[t] = data.valueRanges[i]?.values ?? []))
  }
  return { title: meta.properties.title, tabs }
}

/** Nhận link Google Sheet hoặc ID, trả về ID. */
export function extractSheetId(input: string): string {
  const m = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return (m ? m[1] : input).trim()
}
