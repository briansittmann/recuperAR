<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Método no permitido', 405);

requireAdmin();

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$body  = json_decode(file_get_contents('php://input'), true);
$size  = trim($body['size'] ?? '');
$price = floatval($body['price'] ?? 0);
$stock = intval($body['stock'] ?? 0);

if (!$size || $price <= 0) error('size y price son requeridos');

$conn = getConnection();
$stmt = $conn->prepare('UPDATE product_variants SET size = ?, price = ?, stock = ? WHERE id = ?');
$stmt->bind_param('sdii', $size, $price, $stock, $id);

if (!$stmt->execute()) error('Error al actualizar', 500);
if ($stmt->affected_rows === 0) error('Variante no encontrada', 404);

success(['id' => $id, 'size' => $size, 'price' => $price, 'stock' => $stock]);
