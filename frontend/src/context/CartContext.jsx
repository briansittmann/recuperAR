import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, variant, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.variant_id === variant.id)
      if (existing) {
        return prev.map(i =>
          i.variant_id === variant.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, {
        variant_id: variant.id,
        product_id: product.id,
        name: product.name,
        image: product.image,
        size: variant.size,
        price: variant.price,
        quantity,
      }]
    })
  }

  const removeItem = (variant_id) =>
    setItems(prev => prev.filter(i => i.variant_id !== variant_id))

  const updateQuantity = (variant_id, quantity) => {
    if (quantity < 1) return removeItem(variant_id)
    setItems(prev => prev.map(i => i.variant_id === variant_id ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
