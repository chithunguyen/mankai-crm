import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useToast } from '../components/ui/Toast'
import { forms, type FieldDef, type FormId } from './forms'

type ModalId = FormId | 'quick'

const ModalContext = createContext<(id: ModalId) => void>(() => {})
export const useModal = () => useContext(ModalContext)

function Field({ field }: { field: FieldDef }) {
  return (
    <div className="field">
      <label htmlFor={field.name}>{field.label}</label>
      {field.type === 'select' ? (
        <select id={field.name} name={field.name}>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input id={field.name} name={field.name} type={field.type ?? 'text'} placeholder={field.placeholder} />
      )}
    </div>
  )
}

function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-bg open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <b>{title}</b>
          <button type="button" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  )
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<ModalId | null>(null)
  const toast = useToast()
  const close = () => setOpen(null)

  const submit = (id: FormId) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: gửi Object.fromEntries(new FormData(e.currentTarget)) lên API khi có backend
    close()
    toast(forms[id].successMessage)
  }

  let content: ReactNode = null
  if (open === 'quick') {
    const quick: [FormId, string][] = [
      ['student', '＋ Học viên'],
      ['lead', '＋ Lead'],
      ['task', '＋ Task'],
      ['payment', '＋ Thanh toán'],
    ]
    content = (
      <Modal title="Tạo nhanh" onClose={close}>
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {quick.map(([id, label]) => (
            <button key={id} className="btn secondary" onClick={() => setOpen(id)}>
              {label}
            </button>
          ))}
        </div>
      </Modal>
    )
  } else if (open) {
    const def = forms[open]
    content = (
      <Modal title={def.title} onClose={close}>
        <form onSubmit={submit(open)}>
          <div className="modal-body">
            <div className="formgrid">
              {def.fields.map((f) => (
                <Field key={f.name} field={f} />
              ))}
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn secondary" onClick={close}>
              Hủy
            </button>
            <button type="submit" className="btn">
              {def.submitLabel}
            </button>
          </div>
        </form>
      </Modal>
    )
  }

  return (
    <ModalContext.Provider value={setOpen}>
      {children}
      {content}
    </ModalContext.Provider>
  )
}
