import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../../components/common/Header.jsx'
import Footer from '../../components/common/Footer.jsx'
import Loader from '../../components/common/Loader.jsx'
import { getOrder } from '../../api/orders.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(id).then(res => {
      if (res.success) setOrder(res.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <><Header /><Loader /><Footer /></>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        <h1 style={{ marginBottom: '0.5rem' }}>¡Orden confirmada!</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Orden #{id} — te enviamos un email a <strong>{order?.email}</strong></p>

        {order?.payment_method === 'transfer' && (
          <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Datos para la transferencia</h3>
            <p style={{ margin: '0 0 0.5rem' }}><strong>CBU:</strong> XXXXXXXXXXXXXXXXXXXX</p>
            <p style={{ margin: '0 0 0.5rem' }}><strong>Alias:</strong> RECUPERAR</p>
            <p style={{ margin: '0 0 0.5rem' }}><strong>Titular:</strong> RecuperaAR</p>
            <p style={{ margin: '0 0 1rem' }}><strong>Monto:</strong> {order && formatPrice(order.total)}</p>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              Una vez realizada la transferencia, respondé el email de confirmación con el comprobante.
            </p>
          </div>
        )}

        {order?.payment_method === 'mercadopago' && (
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ margin: 0 }}>Te contactaremos a tu email para coordinar el pago por MercadoPago.</p>
          </div>
        )}

        <Link to="/" style={{ color: '#1a1a1a', fontWeight: 'bold' }}>← Seguir comprando</Link>
      </main>
      <Footer />
    </div>
  )
}
