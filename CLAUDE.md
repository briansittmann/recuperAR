# Reglas para Claude Code — Ahorra Tokens

Copia este contenido en `CLAUDE.md` en la raiz de tu proyecto o en `~/.claude/CLAUDE.md` para que aplique a todos tus proyectos.

---

## 1. No programar sin contexto
- ANTES de escribir codigo: lee los archivos relevantes, revisa git log, entiende la arquitectura.
- Si no tienes contexto suficiente, pregunta. No asumas.

## 2. Respuestas cortas
- Responde en 1-3 oraciones. Sin preambulos, sin resumen final.
- No repitas lo que el usuario dijo. No expliques lo obvio.
- Codigo habla por si mismo: no narres cada linea que escribes.

## 3. No reescribir archivos completos
- Usa Edit (reemplazo parcial), NUNCA Write para archivos existentes salvo que el cambio sea >80% del archivo.
- Cambia solo lo necesario. No "limpies" codigo alrededor del cambio.

## 4. No releer archivos ya leidos
- Si ya leiste un archivo en esta conversacion, no lo vuelvas a leer salvo que haya cambiado.
- Toma notas mentales de lo importante en tu primera lectura.

## 5. Validar antes de declarar hecho
- Despues de un cambio: compila, corre tests, o verifica que funciona.
- Nunca digas "listo" sin evidencia de que funciona.

## 6. Cero charla aduladora
- No digas "Excelente pregunta", "Gran idea", "Perfecto", etc.
- No halagues al usuario. Ve directo al trabajo.

## 7. Soluciones simples
- Implementa lo minimo que resuelve el problema. Nada mas.
- No agregues abstracciones, helpers, tipos, validaciones, ni features que no se pidieron.
- 3 lineas repetidas > 1 abstraccion prematura.

## 8. No pelear con el usuario
- Si el usuario dice "hazlo asi", hazlo asi. No debatas salvo riesgo real de seguridad o perdida de datos.
- Si discrepas, menciona tu concern en 1 oracion y procede con lo que pidio.

## 9. Leer solo lo necesario
- No leas archivos completos si solo necesitas una seccion. Usa offset y limit.
- Si sabes la ruta exacta, usa Read directo. No hagas Glob + Grep + Read cuando Read basta.

## 10. No narrar el plan antes de ejecutar
- No digas "Voy a leer el archivo, luego modificar la funcion, luego compilar...". Solo hazlo.
- El usuario ve tus tool calls. No necesita un preview en texto.

## 11. Paralelizar tool calls
- Si necesitas leer 3 archivos independientes, lee los 3 en un solo mensaje, no uno por uno.
- Menos roundtrips = menos tokens de contexto acumulado.

## 12. No duplicar codigo en la respuesta
- Si ya editaste un archivo, no copies el resultado en tu respuesta. El usuario lo ve en el diff.
- Si creaste un archivo, no lo muestres entero en texto tambien.

## 13. No usar Agent cuando Grep/Read basta
- Agent duplica todo el contexto en un subproceso. Solo usalo para busquedas amplias o tareas complejas.
- Para buscar una funcion o archivo especifico, usa Grep o Glob directo.

# RecuperaAR — Ecommerce

Ecommerce pequeño con backend PHP y frontend React. Desplegado en Hostinger.

## Stack
- **Backend**: PHP puro sin frameworks (Hostinger compartido no soporta Composer fácilmente, el proyecto es pequeño y el deploy es más simple así)
- **Frontend**: React 18 + Vite 6, React Router v6, sin librerías de UI ni de estado
- **Animaciones**: `motion` (CountUp), `gsap` + `@gsap/react` (SplitText con ScrollTrigger). Componentes inline (no es una librería de UI)
- **Hosting**: Hostinger compartido — dominio `recuperarsm.com.ar`

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
    │   └── .htaccess        ← SPA rewrite + cache + headers (Vite lo copia a dist/)
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/
        ├── assets/          ← logo, favicon, video hero, preguntas.html (ref de diseño)
        ├── components/
        │   ├── admin/       ← AdminTable, ProtectedRoute, Sidebar
        │   ├── checkout/    ← PaymentModal
        │   ├── common/      ← Button, ContactCard, ContactModal, CountUp, Footer,
        │   │                  GlareHover (+ .css), Header, Loader, ReadingModal,
        │   │                  ScrollToTop, SplitText
        │   ├── home/        ← ReviewsCarousel
        │   └── shop/        ← CartItem, CategoryCard, CategoryFilter, ProductCard
        ├── config/
        │   ├── payment.js
        │   ├── avisoLegal.md         ← contenido del modal "Aviso Legal"
        │   └── politicaPrivacidad.md ← contenido del modal "Privacidad"
        ├── context/         ← AuthAdminContext, CartContext, ToastContext
        ├── hooks/           ← useCart, useOrders, useProducts, useScrollAnimation
        ├── pages/
        │   ├── admin/       ← Categories, Dashboard, Login, Orders, ProductForm, Products
        │   └── shop/        ← About, Cart, Catalog, Checkout, Home, OrderConfirmation,
        │                       ProductDetail, UnderConstruction
        ├── router/          ← index.jsx (incluye MaintenanceGuard)
        ├── styles/          ← global, variables, header, footer, home, catalog, cart,
        │                       checkout, product-detail, contact-modal, reading-modal,
        │                       reviews-carousel, toast, payment-modal, about,
        │                       under-construction, admin*.css
        └── utils/           ← formatPrice, getImageUrl, slugify, storage
```

## Base de datos (MySQL en Hostinger)
Tablas: `categories`, `products`, `product_variants`, `orders`, `order_items`, `admins`

Migraciones en `backend/api/setup.sql` (aplicar manualmente en phpMyAdmin):
- Tabla `admins`
- `orders.payment_method` (default `'transfer'`)
- `orders.name`, `phone`, `address`, `city`, `province`, `postal_code` (datos del checkout)
- `categories.icon` — nombre de un Material Symbols Outlined

## Backend — decisiones importantes
- `products/update.php` y `categories/update.php` usan **POST** (no PUT) porque PHP no parsea multipart/form-data en PUT
- Imágenes se guardan en `api/uploads/` con nombre único (`uniqid`); el endpoint `product_images/` maneja múltiples imágenes y reorden
- JWT implementado en PHP puro en `config/jwt.php` (sin librerías externas), HS256, expira en 24h
- Configs sensibles en `.gitignore` y subidas manualmente por FTP:
  - `config/db.php` (credenciales MySQL)
  - `config/jwt.php` (clave secreta)
  - `config/payment.php` (CBU, alias, CUIT, email admin)
- `api/uploads/` está en `.gitignore` — las imágenes no van al repo
- `setup_admin.php` es de uso único (crea el admin inicial) y está en `.gitignore`
- Email de transferencia se envía con `helpers/mailer.php` usando `mail()` nativo + MIME multipart (sin PHPMailer; Hostinger compartido no carga librerías externas fácilmente)
- `.htaccess` en `api/` bloquea `.sql/.bak/.php~` y responde a OPTIONS para CORS

## Frontend — decisiones importantes
- URL de la API en `.env` → `VITE_API_URL=https://recuperarsm.com.ar/api`
- Imágenes: `VITE_API_URL.replace('/api', '') + '/' + product.image` (centralizado en `utils/getImageUrl.js`)
- Carrito persistido en `localStorage` (`CartContext`)
- Token JWT del admin en `localStorage` via `utils/storage.js`
- Panel admin protegido con `ProtectedRoute` — redirige a `/admin/login` si no hay token
- Iconos de categoría: Material Symbols Outlined (cargado por CDN en `index.html`)
- Datos bancarios duplicados en backend (`config/payment.php`) y frontend (`src/config/payment.js`) — **mantener sincronizados**
- Productos sin variantes (sin precio ni stock): el botón "Añadir al carrito" se reemplaza por "Consultar" que abre `ContactModal` con asunto y mensaje preconfigurados (ver `ProductDetail.jsx`)
- Aviso Legal y Privacidad: contenido en `src/config/*.md` (importados con `?raw`), renderizados en `ReadingModal` desde el footer

## Modo "En desarrollo" (maintenance mode)
- `pages/shop/UnderConstruction.jsx` se muestra en lugar de las rutas públicas mientras dure el modo
- Implementado vía `MaintenanceGuard` en `router/index.jsx` — envuelve todas las rutas públicas (`/`, `/catalogo`, `/quienes-somos`, `/producto/:slug`, `/carrito`, `/checkout`, `/orden/:id`)
- **Bypass**: visitar `/?preview=recuperar2026` setea `localStorage.preview = '1'` (sticky por navegador) y a partir de ahí ese navegador ve el sitio real. El query param se borra de la URL después
- Las rutas `/admin/*` quedan fuera del guard — se siguen pudiendo cargar productos, etc.
- Para apagar el modo: sacar la capa `MaintenanceGuard` del router (1 línea)
- Para resetear el bypass en un navegador: borrar la key `preview` de localStorage

## Rutas frontend
- Tienda: `/`, `/catalogo`, `/quienes-somos`, `/producto/:slug`, `/carrito`, `/checkout`, `/orden/:id`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/productos[/nuevo|/:id/editar]`, `/admin/categorias`, `/admin/ordenes`

## Flujo de deploy
1. **Backend**: subir `backend/api/` a `public_html/api/` por FTP (incluir `db.php`, `jwt.php` y `payment.php` manualmente — no están en el repo)
2. **Frontend**: `cd frontend && npm run build` → subir contenido de `dist/` a `public_html/`
3. **Migraciones**: aplicar `setup.sql` en phpMyAdmin si hay cambios de schema

## Pagos
- **Transferencia bancaria**: operativo — envía email al cliente con datos bancarios y al admin con el comprobante adjunto
  - Actualizar CBU/alias en `config/payment.php` (backend) y `src/config/payment.js` (frontend)
- **MercadoPago**: pendiente de integración

## Dev local
```bash
cd frontend && npm run dev -- --port 5174
```
La API apunta a Hostinger en producción incluso en local (no hay backend local).
