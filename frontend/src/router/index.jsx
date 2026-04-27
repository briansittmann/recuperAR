import { useEffect } from 'react'
import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ScrollToTop          from '../components/common/ScrollToTop.jsx'
import Home                 from '../pages/shop/Home.jsx'
import Catalog              from '../pages/shop/Catalog.jsx'
import About                from '../pages/shop/About.jsx'
import ProductDetail        from '../pages/shop/ProductDetail.jsx'
import Cart                 from '../pages/shop/Cart.jsx'
import Checkout             from '../pages/shop/Checkout.jsx'
import OrderConfirmation    from '../pages/shop/OrderConfirmation.jsx'
import UnderConstruction    from '../pages/shop/UnderConstruction.jsx'
import Login                from '../pages/admin/Login.jsx'
import Dashboard            from '../pages/admin/Dashboard.jsx'
import Products             from '../pages/admin/Products.jsx'
import ProductForm          from '../pages/admin/ProductForm.jsx'
import Categories           from '../pages/admin/Categories.jsx'
import Orders               from '../pages/admin/Orders.jsx'
import ProtectedRoute       from '../components/admin/ProtectedRoute.jsx'

const PREVIEW_TOKEN = 'recuperar2026'

function MaintenanceGuard() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const token = params.get('preview')
  const hasFlag = typeof window !== 'undefined' && localStorage.getItem('preview') === '1'
  const tokenOk = token === PREVIEW_TOKEN

  useEffect(() => {
    if (tokenOk) {
      localStorage.setItem('preview', '1')
      params.delete('preview')
      const search = params.toString()
      navigate(`${location.pathname}${search ? '?' + search : ''}`, { replace: true })
    }
  }, [tokenOk])

  if (!hasFlag && !tokenOk) return <UnderConstruction />
  return <Outlet />
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MaintenanceGuard />,
        children: [
          { path: '/',              element: <Home /> },
          { path: '/catalogo',      element: <Catalog /> },
          { path: '/quienes-somos', element: <About /> },
          { path: '/producto/:slug',  element: <ProductDetail /> },
          { path: '/carrito',       element: <Cart /> },
          { path: '/checkout',      element: <Checkout /> },
          { path: '/orden/:id',     element: <OrderConfirmation /> },
        ],
      },
      { path: '/admin/login',   element: <Login /> },
      {
        path: '/admin',
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard',  element: <Dashboard /> },
          { path: 'productos',                element: <Products /> },
          { path: 'productos/nuevo',          element: <ProductForm /> },
          { path: 'productos/:id/editar',     element: <ProductForm /> },
          { path: 'categorias', element: <Categories /> },
          { path: 'ordenes',    element: <Orders /> },
        ],
      },
    ],
  },
])
