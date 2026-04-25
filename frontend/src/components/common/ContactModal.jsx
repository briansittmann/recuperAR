import { useEffect } from 'react'
import ContactCard from './ContactCard.jsx'
import '../../styles/home.css'
import '../../styles/contact-modal.css'

export default function ContactModal({ open, onClose }) {
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
      className={`contact-modal__backdrop${open ? ' is-open' : ''}`}
      onClick={onClose}
    >
      <div className="contact-modal" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="contact-modal__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="contact__card">
          <ContactCard onSubmitted={onClose} />
        </div>
      </div>
    </div>
  )
}
