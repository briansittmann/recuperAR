<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

$body           = json_decode(file_get_contents('php://input'), true);
$email          = trim($body['email'] ?? '');
$payment_method = $body['payment_method'] ?? 'transfer'; // 'transfer' | 'mercadopago'
$items          = $body['items'] ?? [];

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) error('Email válido requerido');
if (empty($items)) error('La orden debe tener al menos un producto');
if (!in_array($payment_method, ['transfer', 'mercadopago'])) error('Método de pago inválido');

$conn = getConnection();

// Validar items y calcular total
$total          = 0;
$validatedItems = [];

foreach ($items as $item) {
    $variant_id = intval($item['variant_id'] ?? 0);
    $quantity   = intval($item['quantity'] ?? 0);

    if (!$variant_id || $quantity < 1) error('Datos de item inválidos');

    $stmt = $conn->prepare('SELECT id, price, stock, product_id FROM product_variants WHERE id = ?');
    $stmt->bind_param('i', $variant_id);
    $stmt->execute();
    $variant = $stmt->get_result()->fetch_assoc();

    if (!$variant) error("Variante $variant_id no encontrada", 404);
    if ($variant['stock'] < $quantity) error("Stock insuficiente para la variante $variant_id");

    $total            += $variant['price'] * $quantity;
    $validatedItems[]  = [
        'variant_id' => $variant['id'],
        'product_id' => $variant['product_id'],
        'quantity'   => $quantity,
        'price'      => $variant['price'],
    ];
}

// Crear orden en transacción
$conn->begin_transaction();
try {
    $stmt = $conn->prepare('INSERT INTO orders (email, total, status, payment_method) VALUES (?, ?, ?, ?)');
    $status = 'pending';
    $stmt->bind_param('sdss', $email, $total, $status, $payment_method);
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

// Email para transferencia bancaria
if ($payment_method === 'transfer') {
    $subject  = "RecuperaAR - Orden #$order_id recibida";
    $message  = "¡Hola! Recibimos tu orden #$order_id.\n\n";
    $message .= "Total: $" . number_format($total, 2) . "\n\n";
    $message .= "Para confirmar tu compra, realizá la transferencia a:\n";
    $message .= "CBU: XXXXXXXXXXXXXXXXXXXX\n";   // Actualizar con datos reales
    $message .= "Alias: RECUPERAR\n";             // Actualizar con datos reales
    $message .= "Titular: RecuperaAR\n\n";
    $message .= "Una vez realizada, respondé este email con el comprobante.\n";
    $message .= "¡Muchas gracias por tu compra!";

    mail($email, $subject, $message, "From: noreply@recuperar.com\r\n");
}

success(['order_id' => $order_id, 'total' => $total, 'payment_method' => $payment_method, 'status' => 'pending'], 201);
