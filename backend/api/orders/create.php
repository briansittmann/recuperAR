<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/mailer.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

$payment    = require __DIR__ . '/../config/payment.php';
$adminEmail = $payment['admin_email'] ?? 'info@recuperarsm.com.ar';

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
    // Multipart: datos en $_POST, items en $_POST['items'] como JSON, archivo en $_FILES['receipt']
    $body  = $_POST;
    $items = json_decode($_POST['items'] ?? '[]', true) ?: [];
} else {
    // JSON (compatibilidad / futuro MercadoPago)
    $body  = json_decode(file_get_contents('php://input'), true) ?: [];
    $items = $body['items'] ?? [];
}

$name           = trim($body['name'] ?? '');
$email          = trim($body['email'] ?? '');
$phone          = trim($body['phone'] ?? '');
$address        = trim($body['address'] ?? '');
$city           = trim($body['city'] ?? '');
$province       = trim($body['province'] ?? '');
$postal_code    = trim($body['postal_code'] ?? '');
$payment_method = $body['payment_method'] ?? 'transfer';

if (!$name)                                                 error('Nombre requerido');
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))  error('Email válido requerido');
if (!$phone)                                                error('Teléfono requerido');
if (!$address)                                              error('Dirección requerida');
if (!$city)                                                 error('Ciudad requerida');
if (!$province)                                             error('Provincia requerida');
if (!$postal_code)                                          error('Código postal requerido');
if (empty($items))                                          error('La orden debe tener al menos un producto');
if (!in_array($payment_method, ['transfer', 'mercadopago'])) error('Método de pago inválido');

// Para transferencia: validar comprobante
$receiptPath = null;
$receiptName = null;
if ($payment_method === 'transfer') {
    if (empty($_FILES['receipt']) || $_FILES['receipt']['error'] !== UPLOAD_ERR_OK) {
        error('Comprobante de transferencia requerido');
    }
    $receipt   = $_FILES['receipt'];
    $maxSize   = 5 * 1024 * 1024; // 5MB
    $allowed   = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    $ext       = strtolower(pathinfo($receipt['name'], PATHINFO_EXTENSION));
    $extOk     = in_array($ext, ['jpg', 'jpeg', 'png', 'pdf']);
    $mime      = function_exists('mime_content_type')
        ? mime_content_type($receipt['tmp_name'])
        : ($receipt['type'] ?? '');

    if ($receipt['size'] > $maxSize) error('El comprobante supera el límite de 5MB');
    if (!$extOk || !in_array($mime, $allowed, true)) error('Solo se aceptan archivos PNG, JPG o PDF');
}

$conn = getConnection();

// Validar items y calcular total
$total          = 0;
$validatedItems = [];

foreach ($items as $item) {
    $variant_id = intval($item['variant_id'] ?? 0);
    $quantity   = intval($item['quantity'] ?? 0);

    if (!$variant_id || $quantity < 1) error('Datos de item inválidos');

    $stmt = $conn->prepare(
        'SELECT pv.id, pv.price, pv.stock, pv.product_id, pv.size, p.name AS product_name
         FROM product_variants pv
         JOIN products p ON p.id = pv.product_id
         WHERE pv.id = ?'
    );
    $stmt->bind_param('i', $variant_id);
    $stmt->execute();
    $variant = $stmt->get_result()->fetch_assoc();

    if (!$variant) error("Variante $variant_id no encontrada", 404);
    if ($variant['stock'] < $quantity) error("Stock insuficiente para la variante $variant_id");

    $total            += $variant['price'] * $quantity;
    $validatedItems[]  = [
        'variant_id'   => $variant['id'],
        'product_id'   => $variant['product_id'],
        'quantity'     => $quantity,
        'price'        => $variant['price'],
        'product_name' => $variant['product_name'],
        'size'         => $variant['size'],
    ];
}

// Crear orden en transacción
$conn->begin_transaction();
try {
    $stmt = $conn->prepare(
        'INSERT INTO orders (email, name, phone, address, city, province, postal_code, total, status, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $status = 'pending';
    $stmt->bind_param(
        'sssssssdss',
        $email, $name, $phone, $address, $city, $province, $postal_code,
        $total, $status, $payment_method
    );
    $stmt->execute();
    $order_id = $conn->insert_id;

    foreach ($validatedItems as $item) {
        $ins = $conn->prepare('INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)');
        $ins->bind_param('iiiid', $order_id, $item['product_id'], $item['variant_id'], $item['quantity'], $item['price']);
        $ins->execute();

        $upd = $conn->prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ?');
        $upd->bind_param('ii', $item['quantity'], $item['variant_id']);
        $upd->execute();
    }

    $conn->commit();
} catch (Exception $e) {
    $conn->rollback();
    error('Error al procesar la orden', 500);
}

// Guardar comprobante después del commit (con order_id en el nombre)
if ($payment_method === 'transfer' && !empty($_FILES['receipt']['tmp_name'])) {
    $uploadsDir = __DIR__ . '/../uploads/receipts';
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);

    $ext         = strtolower(pathinfo($_FILES['receipt']['name'], PATHINFO_EXTENSION));
    $receiptName = "{$order_id}_" . time() . ".$ext";
    $receiptPath = "$uploadsDir/$receiptName";

    move_uploaded_file($_FILES['receipt']['tmp_name'], $receiptPath);
}

// ── Emails ──────────────────────────────────────────────────────────────
$items_text = '';
foreach ($validatedItems as $it) {
    $line_total  = $it['price'] * $it['quantity'];
    $size        = $it['size'] ? " (Talle {$it['size']})" : '';
    $items_text .= "  • {$it['product_name']}{$size} x{$it['quantity']} — $" . number_format($line_total, 2) . "\n";
}

$subtotal = $total / 1.21;
$iva      = $total - $subtotal;

$totals_block  = "💰 TOTALES\n";
$totals_block .= "  Subtotal (sin IVA): $" . number_format($subtotal, 2) . "\n";
$totals_block .= "  IVA (21%): $" . number_format($iva, 2) . "\n";
$totals_block .= "  Envío: Gratis\n";
$totals_block .= "  Total: $" . number_format($total, 2) . "\n";

$shipping_block  = "📍 ENVÍO\n";
$shipping_block .= "  Nombre: $name\n";
$shipping_block .= "  Teléfono: $phone\n";
$shipping_block .= "  Email: $email\n";
$shipping_block .= "  Dirección: $address\n";
$shipping_block .= "  $city, $province (CP $postal_code)\n";

if ($payment_method === 'transfer') {
    // 1) Email al admin con comprobante adjunto
    $adminSubject  = "RecuperAR - Nueva orden #$order_id (transferencia)";
    $adminMessage  = "Llegó una nueva orden con comprobante de transferencia.\n\n";
    $adminMessage .= "ORDEN #$order_id\n\n";
    $adminMessage .= "🛒 PRODUCTOS\n$items_text\n";
    $adminMessage .= "$totals_block\n";
    $adminMessage .= "$shipping_block\n";
    $adminMessage .= "Comprobante adjunto en este email.\n";

    sendEmail($adminEmail, $adminSubject, $adminMessage, 'noreply@recuperarsm.com.ar', $receiptPath, $receiptName);

    // 2) Email al cliente confirmando la recepción
    $clientSubject  = "RecuperAR - Recibimos tu pedido #$order_id";
    $clientMessage  = "¡Hola $name!\n\n";
    $clientMessage .= "Recibimos tu pedido #$order_id junto con el comprobante de transferencia.\n";
    $clientMessage .= "Vamos a verificarlo y nos pondremos en contacto con vos en las próximas 24 horas para confirmar el envío.\n\n";
    $clientMessage .= "🛒 RESUMEN DE TU PEDIDO\n$items_text\n";
    $clientMessage .= "$totals_block\n";
    $clientMessage .= "$shipping_block\n";
    $clientMessage .= "Si tenés alguna duda podés responder este email o escribirnos por WhatsApp al +54 11 5221-0035.\n\n";
    $clientMessage .= "¡Muchas gracias por tu compra!\nEquipo RecuperAR";

    sendEmail($email, $clientSubject, $clientMessage);
}

success([
    'order_id'       => $order_id,
    'total'          => $total,
    'payment_method' => $payment_method,
    'status'         => 'pending',
], 201);
