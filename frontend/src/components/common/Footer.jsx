import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReadingModal from './ReadingModal.jsx'
import avisoLegalHtml from '../../config/avisoLegal.md?raw'
import politicaPrivacidadHtml from '../../config/politicaPrivacidad.md?raw'
import '../../styles/footer.css'

export default function Footer() {
  const [legalOpen, setLegalOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <>
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <Link to="/" className="footer__logo">RecuperAR</Link>
            <p className="footer__tagline">Redefiniendo la movilidad a través del diseño y la tecnología.</p>
          </div>

          <div>
            <h6 className="footer__heading">Empresa</h6>
            <nav className="footer__links">
              <Link to="/">Inicio</Link>
              <Link to="/catalogo">Catálogo</Link>
              <Link to="/quienes-somos">Quiénes Somos</Link>
              <a href="/#contacto">Contacto</a>
            </nav>
          </div>

          <div>
            <h6 className="footer__heading">Soporte</h6>
            <nav className="footer__links">
              <button type="button" className="footer__link-btn" onClick={() => setLegalOpen(true)}>
                Aviso Legal
              </button>
              <button type="button" className="footer__link-btn" onClick={() => setPrivacyOpen(true)}>
                Privacidad
              </button>
            </nav>
          </div>

          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} RecuperAR. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <ReadingModal
        open={legalOpen}
        onClose={() => setLegalOpen(false)}
        title="Aviso Legal"
        subtitle="Términos y condiciones de RecuperAR"
        html={avisoLegalHtml}
      />
      <ReadingModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Política de Privacidad"
        subtitle="Cómo tratamos tus datos personales"
        html={politicaPrivacidadHtml}
      />
    </>
  )
}
