import { createBrowserRouter } from 'react-router-dom'
import Home               from '../pages/shop/Home.jsx'
import Catalog            from '../pages/shop/Catalog.jsx'
import ProductDetail      from '../pages/shop/ProductDetail.jsx'
import Cart               from '../pages/shop/Cart.jsx'
import Checkout           from '../pages/shop/Checkout.jsx'
import OrderConfirmation  from '../pages/shop/OrderConfirmation.jsx'
import Login              from '../pages/admin/Login.jsx'
import Dashboard          from '../pages/admin/Dashboard.jsx'
import Products           from '../pages/admin/Products.jsx'
import ProductForm        from '../pages/admin/ProductForm.jsx'
import Categories         from '../pages/admin/Categories.jsx'
import Orders             from '../pages/admin/Orders.jsx'
import ProtectedRoute     from '../components/admin/ProtectedRoute.jsx'

export const router = createBrowserRouter([
  { path: '/',              element: <Home /> },
  { path: '/catalogo',      element: <Catalog /> },
  { path: '/producto/:slug',  element: <ProductDetail /> },
  { path: '/carrito',       element: <Cart /> },
  { path: '/checkout',      element: <Checkout /> },
  { path: '/orden/:id',     element: <OrderConfirmation /> },
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
])
