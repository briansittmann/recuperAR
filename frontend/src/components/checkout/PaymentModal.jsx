import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BANK_INFO } from '../../config/payment.js'
import { formatPrice } from '../../utils/formatPrice.js'
import '../../styles/payment-modal.css'

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf']
const MAX_SIZE    = 5 * 1024 * 1024

const formatBytes = (b) => {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

export default function PaymentModal({ open, onClose, total, onConfirm, loading, error }) {
  const [file, setFile]       = useState(null)
  const [localErr, setErr]    = useState('')
  const [dragging, setDrag]   = useState(false)
  const [copied, setCopied]   = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setFile(null)
      setErr('')
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  const handleFile = (f) => {
    if (!f) return
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXT.includes(ext)) {
      setErr('Solo se aceptan archivos PNG, JPG o PDF')
      return
    }
    if (f.size > MAX_SIZE) {
      setErr('El archivo no puede superar los 5MB')
      return
    }
    setErr('')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = () => {
    if (!file) {
      setErr('Subí el comprobante para continuar')
      return
    }
    onConfirm(file)
  }

  const handleCopy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // ignore
    }
  }

  if (!open) return null

  const showError = localErr || error

  return (
    <div
      className={`payment-modal__backdrop${open ? ' is-open' : ''}`}
      onClick={() => !loading && onClose()}
    >
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="payment-modal__head">
          <div className="payment-modal__title-wrap">
            <h2 className="payment-modal__title">Confirmar transferencia</h2>
            <p className="payment-modal__subtitle">Tu pedido se confirma una vez recibamos el comprobante</p>
          </div>
          <button
            type="button"
            className="payment-modal__close"
            aria-label="Cerrar"
            onClick={onClose}
            disabled={loading}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Bank info */}
        <div className="bank-info">
          <div className="bank-info__amount">
            <span className="bank-info__amount-label">Monto a transferir</span>
            <span className="bank-info__amount-value">{formatPrice(total)}</span>
          </div>
          <div className="bank-info__rows">
            {[
              { key: 'cbu',     label: 'CBU' },
              { key: 'alias',   label: 'Alias' },
              { key: 'titular', label: 'Titular' },
              { key: 'cuit',    label: 'CUIT' },
            ].map(({ key, label }) => BANK_INFO[key] && (
              <div className="bank-info__row" key={key}>
                <span className="bank-info__row-label">{label}</span>
                <div className="bank-info__row-value-wrap">
                  <span className="bank-info__row-value">{BANK_INFO[key]}</span>
                  <button
                    type="button"
                    className={`bank-info__copy${copied === key ? ' is-copied' : ''}`}
                    aria-label={`Copiar ${label}`}
                    onClick={() => handleCopy(key, BANK_INFO[key])}
                  >
                    <span className="material-symbols-outlined">
                      {copied === key ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <ol className="payment-modal__steps">
          <li>Realizá la <strong>transferencia</strong> a la cuenta de arriba.</li>
          <li>Adjuntá la <strong>foto o PDF del comprobante</strong> (PNG, JPG o PDF).</li>
          <li>Confirmamos tu pedido por email <strong>en las próximas 24hs</strong>.</li>
        </ol>

        {/* Upload */}
        <label
          className={`receipt-upload${file ? ' receipt-upload--has-file' : ''}${dragging ? ' receipt-upload--dragging' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                onChange={e => handleFile(e.target.files?.[0])}
                className="receipt-upload__input"
              />
              <div className="receipt-upload__icon">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <span className="receipt-upload__title">Adjuntar comprobante</span>
              <span className="receipt-upload__hint">PNG, JPG o PDF — máx 5MB</span>
            </>
          ) : (
            <div className="receipt-upload__file">
              <div className="receipt-upload__file-icon">
                <span className="material-symbols-outlined">
                  {file.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                </span>
              </div>
              <div className="receipt-upload__file-info">
                <div className="receipt-upload__file-name">{file.name}</div>
                <div className="receipt-upload__file-size">{formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                className="receipt-upload__file-remove"
                aria-label="Quitar archivo"
                onClick={e => { e.preventDefault(); e.stopPropagation(); setFile(null) }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}
        </label>

        {showError && <p className="payment-modal__error">{showError}</p>}

        <button
          type="button"
          className="payment-modal__btn"
          onClick={handleSubmit}
          disabled={loading || !file}
        >
          <span className="material-symbols-outlined">shopping_cart_checkout</span>
          {loading ? 'Enviando…' : 'Finalizar Compra'}
        </button>
      </div>
    </div>
  )
}

export function PaymentSuccessModal({ open, orderId }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!open) return null

  return (
    <div className={`payment-modal__backdrop${open ? ' is-open' : ''}`}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="payment-success">
          <div className="payment-success__icon">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          {orderId && <span className="payment-success__order">Pedido #{orderId}</span>}
          <h2 className="payment-success__title">¡Recibimos tu comprobante!</h2>
          <p className="payment-success__text">
            Vamos a verificar la transferencia y nos pondremos en contacto con vos por email
            en las próximas <strong>24 horas</strong> para confirmar el envío.
          </p>
          <Link to="/" className="payment-modal__btn">
            <span className="material-symbols-outlined">home</span>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
