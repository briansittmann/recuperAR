import { useEffect, useState } from 'react'
import ContactModal from '../../components/common/ContactModal.jsx'
import logo from '../../assets/recuperar-logo.png'
import favicon from '../../assets/favicon.png'
import '../../styles/under-construction.css'

export default function UnderConstruction() {
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const prevOverflow = document.body.style.overflow
    document.body.style.paddingTop = '0'
    return () => {
      document.head.removeChild(meta)
      document.body.style.paddingTop = ''
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div className="uc-page">
      <div className="uc-blob uc-blob--1" aria-hidden="true" />
      <div className="uc-blob uc-blob--2" aria-hidden="true" />

      <header className="uc-header">
        <img src={logo} alt="RecuperAR" className="uc-header__logo" />
      </header>

      <main className="uc-main">
        <div className="uc-card">
          <div className="uc-spinner-wrap">
            <div className="uc-spinner">
              <div className="uc-spinner__ring-bg" />
              <div className="uc-spinner__ring" />
              <img src={favicon} alt="" className="uc-spinner__logo" />
            </div>
          </div>

          <h1 className="uc-title">
            Estamos preparando algo <span className="uc-title__accent">nuevo</span> para vos
          </h1>
          <p className="uc-desc">
            Nuestro nuevo sitio de ortopedia personalizada está en los últimos retoques. Muy pronto vas a poder ver toda nuestra línea y hacer tus consultas online.
          </p>

          <div className="uc-actions">
            <a
              href="https://wa.me/541152210035"
              target="_blank"
              rel="noopener noreferrer"
              className="uc-btn uc-btn--whatsapp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.235 1.592 5.228 0 9.483-4.256 9.485-9.485.002-5.235-4.262-9.485-9.487-9.485-5.228 0-9.483 4.256-9.485 9.485 0 2.035.566 3.541 1.644 5.22l-.961 3.511 3.569-.928zm10.596-6.703c-.313-.157-1.851-.913-2.138-1.018-.286-.104-.495-.157-.704.157-.209.314-.809 1.018-.992 1.227-.182.209-.364.235-.677.079-1.34-.673-2.222-1.12-3.111-2.651-.235-.404.235-.375.673-1.25.078-.157.039-.294-.02-.411-.059-.117-.495-1.192-.678-1.633-.178-.432-.359-.373-.495-.38l-.421-.008c-.144 0-.379.054-.577.269-.198.214-.756.738-.756 1.8 0 1.062.772 2.088.88 2.232.108.144 1.519 2.319 3.679 3.251 2.16.932 2.16.621 2.551.584.391-.037 1.264-.517 1.442-1.018.178-.501.178-.931.124-1.018-.053-.087-.194-.139-.507-.296z" />
              </svg>
              WhatsApp
            </a>
            <button type="button" onClick={() => setContactOpen(true)} className="uc-btn">
              <span className="material-symbols-outlined">mail</span>
              Escribinos
            </button>
            <a href="tel:+541152210035" className="uc-btn">
              <span className="material-symbols-outlined">call</span>
              Llamar
            </a>
          </div>
        </div>
      </main>

      <footer className="uc-footer">
        © {new Date().getFullYear()} RecuperAR · Próximamente
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
