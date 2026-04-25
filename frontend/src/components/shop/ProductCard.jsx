import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/getImageUrl.js'

export default function ProductCard({ product }) {
  return (
    <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
        {product.image
          ? <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
          : <div style={{ width: '100%', aspectRatio: '1', background: '#f0f0f0' }} />
        }
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{product.name}</h3>
          {product.category_name && <p style={{ margin: '0 0 0.5rem', color: '#888', fontSize: '0.85rem' }}>{product.category_name}</p>}
          {product.min_price && <p style={{ margin: 0, fontWeight: 'bold' }}>Desde {formatPrice(product.min_price)}</p>}
        </div>
      </div>
    </Link>
  )
}
