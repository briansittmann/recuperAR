# RecuperaAR — Ecommerce

Ecommerce pequeño con backend PHP y frontend React. Desplegado en Hostinger.

## Stack
- **Backend**: PHP puro sin frameworks (Hostinger compartido no soporta Composer fácilmente, el proyecto es pequeño y el deploy es más simple así)
- **Frontend**: React + Vite, React Router v6, sin librerías de UI
- **Hosting**: Hostinger — dominio `recuperarsm.com.ar`

## Estructura del proyecto
```
RecuperaAR/
  backend/api/       → API REST en PHP (subir a public_html/api/)
  frontend/          → App React (build → subir dist/ a public_html/)
  CLAUDE.md
  .gitignore
```

## Base de datos (MySQL en Hostinger)
Tablas: `categories`, `products`, `product_variants`, `orders`, `order_items`, `admins`
- `admins` y columna `payment_method` en orders fueron agregadas via `setup.sql`

## Backend — decisiones importantes
- `products/update.php` usa **POST** (no PUT) porque PHP no parsea multipart/form-data en PUT
- Imágenes se guardan en `api/uploads/` con nombre único (`uniqid`)
- JWT implementado en PHP puro en `config/jwt.php` (sin librerías externas)
- `config/db.php` y `config/jwt.php` están en `.gitignore` — subirlos manualmente por FTP
- `api/uploads/` está en `.gitignore` — las imágenes no van al repo

## Frontend — decisiones importantes
- URL de la API en `.env` → `VITE_API_URL=https://recuperarsm.com.ar/api`
- Imágenes: `VITE_API_URL.replace('/api', '') + '/' + product.image`
- Carrito persistido en `localStorage`
- Token JWT del admin en `localStorage` via `utils/storage.js`
- Panel admin protegido con `ProtectedRoute` — redirige a `/admin/login` si no hay token

## Flujo de deploy
1. **Backend**: subir `backend/api/` a `public_html/api/` por FTP (incluir `db.php` y `jwt.php` manualmente)
2. **Frontend**: `npm run build` → subir contenido de `dist/` a `public_html/`

## Pagos
- **Transferencia bancaria**: operativo — envía email al cliente con datos bancarios
  - Actualizar CBU y alias en `orders/create.php` y `pages/shop/OrderConfirmation.jsx`
- **MercadoPago**: pendiente de integración

## Dev local
```bash
cd frontend && npm run dev -- --port 5174
```
La API apunta a Hostinger en producción incluso en local.
