import { useEffect } from 'react'
import '../../styles/reading-modal.css'

export default function ReadingModal({ open, onClose, title, subtitle, html }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const onKey = (e) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`reading-modal__backdrop${open ? ' is-open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <section className="reading-modal" onClick={e => e.stopPropagation()}>
        <header className="reading-modal__head">
          <div className="reading-modal__heading">
            <h1 className="reading-modal__title">{title}</h1>
            {subtitle && <p className="reading-modal__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="reading-modal__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div
          className="reading-modal__body liquid-scroll"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </div>
  )
}
