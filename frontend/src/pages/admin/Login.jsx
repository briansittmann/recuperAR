import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/admin.js'
import { useAuthAdmin } from '../../context/AuthAdminContext.jsx'
import '../../styles/admin-login.css'

export default function Login() {
  const { loginAdmin } = useAuthAdmin()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(email, password)
    if (res.success) {
      loginAdmin(res.data.token)
      navigate('/admin/dashboard')
    } else {
      setError(res.error || 'Credenciales inválidas')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login__orb admin-login__orb--1" />
      <div className="admin-login__orb admin-login__orb--2" />

      <div className="admin-login">
        <div className="admin-login__head">
          <div className="admin-login__logo">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <h1 className="admin-login__title">Panel Administrador</h1>
          <p className="admin-login__subtitle">Ingresá con tu cuenta para gestionar la tienda</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-email">Email</label>
            <div className="admin-field__input-wrap">
              <input
                id="admin-email"
                type="email"
                className="admin-field__input"
                placeholder="admin@recuperarsm.com.ar"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-password">Contraseña</label>
            <div className="admin-field__input-wrap">
              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                className="admin-field__input admin-field__input--with-toggle"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-field__toggle"
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPwd(p => !p)}
              >
                <span className="material-symbols-outlined">
                  {showPwd ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login__error">
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="admin-login__submit" disabled={loading}>
            <span className="material-symbols-outlined">login</span>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link to="/" className="admin-login__back">
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al sitio
        </Link>
      </div>
    </div>
  )
}
