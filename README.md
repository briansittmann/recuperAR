# RecuperaAR - Ecommerce

## Descripción

Ecommerce pequeño con backend PHP y frontend React. Desplegado en Hostinger en el dominio `recuperarsm.com.ar`.

## Tecnologías

- **Backend**: PHP puro sin frameworks (Hostinger compartido no soporta Composer fácilmente, el proyecto es pequeño y el deploy es más simple así)
- **Frontend**: React + Vite, React Router v6, sin librerías de UI
- **Animaciones**: `motion` (CountUp), `gsap` + `@gsap/react` (SplitText con ScrollTrigger)
- **Base de datos**: MySQL en Hostinger
- **Hosting**: Hostinger

## Estructura del proyecto

```
RecuperaAR/
├── CLAUDE.md
├── README.md
├── backend/
│   └── api/
│       ├── setup_admin.php
│       ├── setup.sql
│       ├── admin/
│       │   └── login.php
│       ├── categories/
│       │   ├── create.php
│       │   ├── delete.php
│       │   ├── index.php
│       │   └── update.php
│       ├── config/
│       │   ├── db.example.php
│       │   ├── db.php
│       │   ├── jwt.example.php
│       │   ├── jwt.php
│       │   └── payment.php
│       ├── helpers/
│       │   ├── auth.php
│       │   ├── cors.php
│       │   ├── mailer.php
│       │   └── response.php
│       ├── orders/
│       │   ├── create.php
│       │   ├── index.php
│       │   ├── show.php
│       │   └── update_status.php
│       ├── product_images/
│       │   ├── create.php
│       │   ├── delete.php
│       │   └── reorder.php
│       ├── products/
│       │   ├── create.php
│       │   ├── delete.php
│       │   ├── index.php
│       │   ├── show.php
│       │   └── update.php
│       ├── uploads/
│       └── variants/
│           ├── create.php
│           ├── delete.php
│           └── update.php
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── .htaccess        # SPA rewrite + cache + headers (Vite lo copia a dist/)
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/             # admin, categories, orders, products
        ├── assets/          # logo, favicon, video hero, refs de diseño
        ├── components/
        │   ├── admin/       # AdminTable, ProtectedRoute, Sidebar
        │   ├── checkout/    # PaymentModal
        │   ├── common/      # Button, ContactCard, ContactModal, CountUp, Footer,
        │   │                # GlareHover, Header, Loader, ReadingModal,
        │   │                # ScrollToTop, SplitText
        │   ├── home/        # ReviewsCarousel
        │   └── shop/        # CartItem, CategoryCard, CategoryFilter, ProductCard
        ├── config/
        │   ├── payment.js
        │   ├── avisoLegal.md         # contenido del modal "Aviso Legal"
        │   └── politicaPrivacidad.md # contenido del modal "Privacidad"
        ├── context/         # AuthAdminContext, CartContext, ToastContext
        ├── hooks/           # useCart, useOrders, useProducts, useScrollAnimation
        ├── pages/
        │   ├── admin/       # Categories, Dashboard, Login, Orders, ProductForm, Products
        │   └── shop/        # About, Cart, Catalog, Checkout, Home, OrderConfirmation,
        │                    # ProductDetail, UnderConstruction
        ├── router/          # index.jsx (incluye MaintenanceGuard)
        ├── styles/          # variables, global, header, footer, home, catalog, cart,
        │                    # checkout, product-detail, contact-modal, reading-modal,
        │                    # reviews-carousel, toast, payment-modal, about,
        │                    # under-construction, admin*.css
        └── utils/           # formatPrice, getImageUrl, slugify, storage
```

## Base de datos

Tablas: `categories`, `products`, `product_variants`, `orders`, `order_items`, `admins`.

Migraciones manuales en `backend/api/setup.sql` (aplicar en phpMyAdmin):
- Tabla `admins`
- `orders.payment_method` (default `'transfer'`)
- `orders.name`, `phone`, `address`, `city`, `province`, `postal_code` (datos del checkout)
- `categories.icon` — nombre de un Material Symbols Outlined

## Backend — decisiones importantes

- `products/update.php` y `categories/update.php` usan **POST** (no PUT) porque PHP no parsea multipart/form-data en PUT
- Imágenes se guardan en `api/uploads/` con nombre único (`uniqid`); el endpoint `product_images/` maneja múltiples imágenes y reorden
- JWT implementado en PHP puro en `config/jwt.php` (sin librerías externas), HS256, expira en 24h
- Email de transferencia se envía con `helpers/mailer.php` usando `mail()` + MIME multipart (sin PHPMailer)
- Configs sensibles en `.gitignore`, subir manualmente por FTP: `config/db.php`, `config/jwt.php`, `config/payment.php`
- `api/uploads/` está en `.gitignore` — las imágenes no van al repo

## Frontend — decisiones importantes

- URL de la API en `.env` → `VITE_API_URL=https://recuperarsm.com.ar/api`
- Imágenes: `VITE_API_URL.replace('/api', '') + '/' + product.image` (centralizado en `utils/getImageUrl.js`)
- Carrito persistido en `localStorage` (`CartContext`)
- Token JWT del admin en `localStorage` via `utils/storage.js`
- Panel admin protegido con `ProtectedRoute` — redirige a `/admin/login` si no hay token
- Iconos de categoría: Material Symbols Outlined (cargado por CDN en `index.html`)
- Productos sin variantes (sin precio ni stock): "Añadir al carrito" se reemplaza por "Consultar" y abre el `ContactModal` con asunto y mensaje predefinidos
- Aviso Legal y Privacidad: contenido en `src/config/*.md` (importados con `?raw`), renderizados en un `ReadingModal` desde el footer

## Modo "En desarrollo" (maintenance mode)

Toda la parte pública del sitio queda detrás de un guard que muestra `UnderConstruction.jsx` en lugar de las rutas reales.

- **Bypass por navegador**: visitar `https://recuperarsm.com.ar/?preview=recuperar2026` setea `localStorage.preview = '1'` y a partir de ahí ese navegador ve el sitio real (sticky).
- Las rutas `/admin/*` quedan fuera del guard — el panel sigue funcionando para cargar productos.
- Para apagar el modo: en `frontend/src/router/index.jsx` sacar la capa `MaintenanceGuard` y volver a anidar las rutas públicas directamente bajo `RootLayout`.
- Para resetear el bypass en un navegador: borrar la key `preview` de localStorage.

## Instalación y desarrollo local

### Prerrequisitos

- Node.js
- PHP
- MySQL

### Backend

No hay entorno PHP local. Para trabajar en backend, editar archivos en `backend/api/`, subirlos por FTP a `public_html/api/` y probar contra `https://recuperarsm.com.ar/api`.

Configs sensibles (no están en el repo, hay que crearlas en el servidor):

1. Copiar `config/db.example.php` a `config/db.php` y configurar credenciales MySQL.
2. Copiar `config/jwt.example.php` a `config/jwt.php` y generar un `JWT_SECRET` aleatorio largo.
3. Crear `config/payment.php` con CBU, alias, CUIT y email del admin.
4. Aplicar `setup.sql` en phpMyAdmin si hay cambios de schema.
5. Para crear el admin inicial: subir `setup_admin.php` por única vez, ejecutarlo en el navegador y borrarlo del servidor.

### Frontend

1. Navegar a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev -- --port 5174
   ```

Nota: La API apunta a Hostinger en producción incluso en local.

## Despliegue

1. **Backend**: subir `backend/api/` a `public_html/api/` por FTP (incluir `config/db.php`, `config/jwt.php` y `config/payment.php` manualmente — no están en el repo).
2. **Frontend**: ejecutar `npm run build` en `frontend/`, luego subir el contenido de `dist/` a `public_html/`.
3. **Migraciones**: aplicar `setup.sql` en phpMyAdmin si hay cambios de schema.

## Pagos

- **Transferencia bancaria**: operativo — envía email al cliente con datos bancarios y al admin con el comprobante adjunto.
  - Para cambiar datos bancarios actualizar **ambos** archivos:
    - `backend/api/config/payment.php`
    - `frontend/src/config/payment.js`
- **MercadoPago**: pendiente de integración.