import { useState } from 'react'
import hablamosImage from '../../assets/contact.jpeg'

export default function ContactCard({ onSubmitted, initialSubject = '', initialMessage = '' }) {
  const [form, setForm] = useState({ name: '', email: '', subject: initialSubject, message: initialMessage })

  const setField = (f) => (e) => setForm(s => ({ ...s, [f]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'Consulta RecuperAR')
    const body    = encodeURIComponent(`Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:info@recuperarsm.com.ar?subject=${subject}&body=${body}`
    onSubmitted?.()
  }

  return (
    <>
      <div className="contact__info">
        <img src={hablamosImage} alt="" className="contact__info-img" />
        <div className="contact__info-content">
          <h2 className="contact__title">¿Hablamos?</h2>
          <p className="contact__desc">
            Estamos para resolver cualquier duda y ayudarte a encontrar la mejor opción para vos.
          </p>
          <a
            href="https://wa.me/541152210035"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp"
          >
            <svg viewBox="0 0 24 24" className="btn__icon" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.235 1.592 5.228 0 9.483-4.256 9.485-9.485.002-5.235-4.262-9.485-9.487-9.485-5.228 0-9.483 4.256-9.485 9.485 0 2.035.566 3.541 1.644 5.22l-.961 3.511 3.569-.928zm10.596-6.703c-.313-.157-1.851-.913-2.138-1.018-.286-.104-.495-.157-.704.157-.209.314-.809 1.018-.992 1.227-.182.209-.364.235-.677.079-1.34-.673-2.222-1.12-3.111-2.651-.235-.404.235-.375.673-1.25.078-.157.039-.294-.02-.411-.059-.117-.495-1.192-.678-1.633-.178-.432-.359-.373-.495-.38l-.421-.008c-.144 0-.379.054-.577.269-.198.214-.756.738-.756 1.8 0 1.062.772 2.088.88 2.232.108.144 1.519 2.319 3.679 3.251 2.16.932 2.16.621 2.551.584.391-.037 1.264-.517 1.442-1.018.178-.501.178-.931.124-1.018-.053-.087-.194-.139-.507-.296z" />
            </svg>
            Escribinos por WhatsApp
          </a>
        </div>
      </div>

      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__form-row">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" type="text" placeholder="Tu nombre" value={form.name} onChange={setField('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="tu@email.com" value={form.email} onChange={setField('email')} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Asunto</label>
          <input className="form-input" type="text" placeholder="¿En qué podemos ayudarte?" value={form.subject} onChange={setField('subject')} />
        </div>
        <div className="form-group">
          <label className="form-label">Mensaje</label>
          <textarea className="form-input form-input--textarea" rows="4" placeholder="Contanos tus necesidades..." value={form.message} onChange={setField('message')} required />
        </div>
        <button type="submit" className="btn btn--primary btn--full">Enviar Mensaje</button>
      </form>
    </>
  )
}
