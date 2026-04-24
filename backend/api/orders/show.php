<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Método no permitido', 405);

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$conn = getConnection();

$stmt = $conn->prepare('SELECT id, email, total, status, payment_method, created_at FROM orders WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();
if (!$order) error('Orden no encontrada', 404);

$stmt2 = $conn->prepare(
    'SELECT oi.id, oi.quantity, oi.price,
            p.name AS product_name, p.image AS product_image,
            pv.size
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = ?'
);
$stmt2->bind_param('i', $id);
$stmt2->execute();
$order['items'] = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);

success($order);
