import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { productPath } from '../../utils/slugify.js'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="cart-item">
      <Link to={productPath({ id: item.product_id, name: item.name })} className="cart-item__img-wrap">
        {item.image
          ? <img src={getImageUrl(item.image)} alt={item.name} className="cart-item__img" />
          : <span className="material-symbols-outlined cart-item__placeholder">image</span>
        }
      </Link>

      <div className="cart-item__body">
        <div className="cart-item__top">
          <Link to={productPath({ id: item.product_id, name: item.name })} className="cart-item__name">{item.name}</Link>
          <button
            type="button"
            className="cart-item__remove"
            aria-label="Eliminar"
            onClick={() => removeItem(item.variant_id)}
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>

        {item.size && <p className="cart-item__meta">Talle: {item.size}</p>}

        <div className="cart-item__bottom">
          <div className="qty-control">
            <button
              type="button"
              className="qty-control__btn"
              aria-label="Disminuir"
              onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="qty-control__value">{item.quantity}</span>
            <button
              type="button"
              className="qty-control__btn"
              aria-label="Aumentar"
              onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <p className="cart-item__price">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  )
}
