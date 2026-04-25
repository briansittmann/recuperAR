import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthAdminProvider } from './context/AuthAdminContext.jsx'

export default function App() {
  return (
    <AuthAdminProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthAdminProvider>
  )
}
