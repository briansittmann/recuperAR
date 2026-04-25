import { Link } from 'react-router-dom'
import '../../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <span className="footer__logo">RecuperAR</span>
          <p className="footer__tagline">Redefiniendo la movilidad a través del diseño y la tecnología.</p>
        </div>

        <div>
          <h6 className="footer__heading">Empresa</h6>
          <nav className="footer__links">
            <Link to="/">Inicio</Link>
            <Link to="/catalogo">Catálogo</Link>
            <a href="/#contacto">Contacto</a>
          </nav>
        </div>

        <div>
          <h6 className="footer__heading">Soporte</h6>
          <nav className="footer__links">
            <a href="#">Aviso Legal</a>
            <a href="#">Privacidad</a>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} RecuperAR. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
