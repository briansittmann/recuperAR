import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import CountUp from '../../components/common/CountUp.jsx'
import GlareHover from '../../components/common/GlareHover.jsx'
import SplitText from '../../components/common/SplitText.jsx'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'
import '../../styles/about.css'

const galleryItems = [
  { icon: 'precision_manufacturing', title: 'Ajuste de precisión', caption: 'Personalización técnica para cada usuario.' },
  { icon: 'inventory_2',             title: 'Gestión de Stock',    caption: 'Disponibilidad inmediata de soluciones.' },
  { icon: 'local_shipping',          title: 'Servicio Técnico',    caption: 'Entrega técnica y capacitación en domicilio.' },
  { icon: 'groups',                  title: 'Empresa Familiar',    caption: 'Un equipo diverso unido por la vocación.' },
]

const processSteps = [
  { icon: 'description',          title: '1. Prescripción', desc: 'Analizamos la indicación médica con rigor técnico y sensibilidad humana.', variant: '' },
  { icon: 'troubleshoot',         title: '2. Evaluación',   desc: 'Evaluamos la mejor tecnología disponible que se adapte a tu estilo de vida.', variant: 'about-process__icon--alt' },
  { icon: 'assignment_turned_in', title: '3. Gestión',      desc: 'Nos encargamos de toda la gestión administrativa para agilizar tu trámite.', variant: 'about-process__icon--accent' },
  { icon: 'celebration',          title: '4. Entrega',      desc: 'Entrega técnica y seguimiento continuo para asegurar tu total adaptación.', variant: '' },
]

const values = [
  { icon: 'favorite',   title: 'Empatía',         desc: 'Entendemos tu realidad.' },
  { icon: 'handshake',  title: 'Compromiso',      desc: 'Estamos con vos siempre.' },
  { icon: 'shield',     title: 'Responsabilidad', desc: 'Actuamos con integridad.' },
  { icon: 'visibility', title: 'Transparencia',   desc: 'Claridad en cada paso.' },
  { icon: 'stars',      title: 'Calidad',         desc: 'Excelencia garantizada.' },
]

const faqs = [
  {
    question: '¿Hacen envíos a todo el país?',
    answer: 'Sí, realizamos envíos técnicos a toda la Argentina, asegurando que el producto llegue en condiciones óptimas y con el asesoramiento necesario.',
  },
  {
    question: '¿Cómo es el proceso de personalización?',
    answer: 'Comienza con una evaluación de la prescripción médica, seguida de una toma de medidas y selección de componentes específicos según las necesidades biomecánicas del usuario.',
  },
  {
    question: '¿Trabajan con obras sociales?',
    answer: 'Gestionamos presupuestos y documentación para presentar ante las principales obras sociales y prepagas del país.',
  },
]

export default function About() {
  useScrollAnimation()

  return (
    <div className="about-page">
      <Header />

      <main className="about-main">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero__bg">
            <div className="about-gallery__placeholder" style={{ width: '100%', height: '100%' }}>
              <span className="material-symbols-outlined">image</span>
            </div>
            <div className="about-hero__bg-overlay" />
          </div>
          <div className="about-hero__inner">
            <div className="about-hero__content">
              <SplitText
                tag="h1"
                text="Somos el puente entre la prescripción y la solución"
                className="about-hero__title"
                textAlign="left"
                splitType="words"
                delay={60}
                duration={0.8}
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
                rootMargin="0px"
              />
              <p className="about-hero__desc" data-animate="fade-up" data-delay="400">
                En RecuperAR, transformamos la movilidad y el bienestar a través de ortopedia personalizada de alta tecnología y un compromiso humano inquebrantable.
              </p>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="about-stats">
          <div className="about-stats__inner">
            <div className="about-stats__grid">
              <div className="about-stat" data-animate="fade-up">
                <span className="material-symbols-outlined about-stat__icon">history</span>
                <h3 className="about-stat__value">
                  +<CountUp from={0} to={10} duration={1.5} />
                </h3>
                <p className="about-stat__label">Años de experiencia</p>
              </div>
              <div className="about-stat" data-animate="fade-up" data-delay="100">
                <span className="material-symbols-outlined about-stat__icon">local_shipping</span>
                <h3 className="about-stat__value">
                  +<CountUp from={0} to={5000} duration={2} separator="." />
                </h3>
                <p className="about-stat__label">Entregas realizadas</p>
              </div>
              <div className="about-stat" data-animate="fade-up" data-delay="200">
                <span className="material-symbols-outlined about-stat__icon">public</span>
                <h3 className="about-stat__value">Nacional</h3>
                <p className="about-stat__label">Cobertura en todo el país</p>
              </div>
              <div className="about-stat" data-animate="fade-up" data-delay="300">
                <span className="material-symbols-outlined about-stat__icon">volunteer_activism</span>
                <h3 className="about-stat__value">Humana</h3>
                <p className="about-stat__label">Atención personalizada</p>
              </div>
            </div>
          </div>
        </section>

        {/* Historia */}
        <section className="about-history">
          <div className="about-history__inner">
            <div className="about-history__media" data-animate="fade-left">
              <div className="about-history__media-wrap">
                <div className="about-history__media-glow" />
                <div className="about-gallery__placeholder about-history__img">
                  <span className="material-symbols-outlined">image</span>
                </div>
              </div>
            </div>
            <div className="about-history__text" data-animate="fade-right" data-delay="100">
              <h2 className="about-history__title">Una empresa familiar con vocación de servicio</h2>
              <div className="about-history__paragraphs">
                <p>RecuperAR nació de un sueño compartido: brindar soluciones ortopédicas que no solo cubrieran necesidades clínicas, sino que devolvieran la dignidad y la autonomía a las personas.</p>
                <p>Como empresa familiar, entendemos que cada entrega no es solo un producto, es una herramienta para que una familia vuelva a caminar unida. Nuestra trayectoria se ha forjado con paciencia, escuchando a cada paciente y adaptando la tecnología a sus vidas, no al revés.</p>
                <div className="about-history__commitment">
                  <div className="about-history__commitment-glare">
                    <GlareHover
                      width="3rem"
                      height="3rem"
                      background="transparent"
                      borderColor="transparent"
                      borderRadius="50%"
                      glareColor="#ffffff"
                      glareOpacity={0.9}
                      glareAngle={-45}
                      glareSize={200}
                      transitionDuration={700}
                      className="about-history__commitment-icon-glare"
                    >
                      <div className="about-history__commitment-icon">
                        <span className="material-symbols-outlined">verified_user</span>
                      </div>
                    </GlareHover>
                    <GlareHover
                      width="auto"
                      height="auto"
                      background="transparent"
                      borderColor="transparent"
                      borderRadius="9999px"
                      glareColor="#ffffff"
                      glareOpacity={0.7}
                      glareAngle={-30}
                      glareSize={250}
                      transitionDuration={700}
                      className="about-history__commitment-text-glare"
                    >
                      <span className="about-history__commitment-text">Compromiso RecuperAR</span>
                    </GlareHover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Galería */}
        <section className="about-gallery">
          <div className="about-gallery__inner">
            <div className="about-section-head" data-animate="fade-up">
              <span className="about-section-head__eyebrow">Cercanía y Calidad</span>
              <h2 className="about-section-head__title">Nuestro trabajo, todos los días</h2>
              <p className="about-section-head__sub">Cada detalle cuenta en nuestro compromiso por devolver la autonomía a nuestros pacientes.</p>
            </div>
            <div className="about-gallery__grid">
              {galleryItems.map((item, i) => (
                <div key={item.title} className="about-gallery__card" data-animate="fade-up" data-delay={i * 100}>
                  <div className="about-gallery__media">
                    <div className="about-gallery__placeholder">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                    <div className="about-gallery__overlay">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                  </div>
                  <div className="about-gallery__body">
                    <h4 className="about-gallery__title">{item.title}</h4>
                    <p className="about-gallery__caption">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="about-values">
          <div className="about-values__inner">
            <div className="about-values__head" data-animate="fade-up">
              <h2 className="about-values__head-title">Lo que nos define</h2>
            </div>
            <div className="about-values__grid">
              {values.map((v, i) => (
                <div key={v.title} className="about-value" data-animate="fade-up" data-delay={i * 100}>
                  <GlareHover
                    width="100%"
                    height="100%"
                    background="rgba(255, 255, 255, 0.7)"
                    borderRadius="2rem"
                    borderColor="rgba(255, 255, 255, 0.4)"
                    glareColor="#91ccf5"
                    glareOpacity={0.6}
                    glareAngle={-30}
                    glareSize={250}
                    transitionDuration={700}
                    className="about-value__glare"
                  >
                    <div className="about-value__content">
                      <div className="about-value__icon">
                        <span className="material-symbols-outlined">{v.icon}</span>
                      </div>
                      <h5 className="about-value__title">{v.title}</h5>
                      <p className="about-value__desc">{v.desc}</p>
                    </div>
                  </GlareHover>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="about-process">
          <div className="about-process__inner">
            <div className="about-section-head" data-animate="fade-up">
              <h2 className="about-section-head__title">Nuestro Proceso de Acompañamiento</h2>
              <p className="about-section-head__sub">Un flujo transparente y eficiente diseñado para minimizar tus tiempos de espera y maximizar tu bienestar.</p>
            </div>
            <div className="about-process__grid">
              {processSteps.map((step, i) => (
                <div key={step.title} className="about-process__step" data-animate="fade-right" data-delay={i * 200}>
                  <div className="about-process__card">
                    <div className={`about-process__icon ${step.variant}`}>
                      <span className="material-symbols-outlined">{step.icon}</span>
                    </div>
                    <h4 className="about-process__step-title">{step.title}</h4>
                    <p className="about-process__step-desc">{step.desc}</p>
                  </div>
                  {i < processSteps.length - 1 && (
                    <span className="material-symbols-outlined about-process__arrow">trending_flat</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preguntas Frecuentes */}
        <section className="about-faq">
          <div className="about-faq__inner">
            <div className="about-section-head" data-animate="fade-up">
              <h2 className="about-section-head__title">Preguntas Frecuentes</h2>
              <p className="about-section-head__sub">Despejamos tus dudas sobre nuestro servicio.</p>
            </div>
            <div className="about-faq__list">
              {faqs.map((faq, i) => (
                <div key={faq.question} className="about-faq__card" data-animate="fade-up" data-delay={i * 100}>
                  <h4 className="about-faq__question">
                    <span className="material-symbols-outlined about-faq__question-icon">help</span>
                    {faq.question}
                  </h4>
                  <p className="about-faq__answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="scroll-top">
        <button className="scroll-top__btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="material-symbols-outlined">keyboard_arrow_up</span>
          Volver al inicio
        </button>
      </div>

      <Footer />
    </div>
  )
}
