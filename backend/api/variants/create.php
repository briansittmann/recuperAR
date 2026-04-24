<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$body       = json_decode(file_get_contents('php://input'), true);
$product_id = intval($body['product_id'] ?? 0);
$size       = trim($body['size'] ?? '');
$price      = floatval($body['price'] ?? 0);
$stock      = intval($body['stock'] ?? 0);

if (!$product_id || !$size || $price <= 0) error('product_id, size y price son requeridos');

$conn = getConnection();
$stmt = $conn->prepare('INSERT INTO product_variants (product_id, size, price, stock) VALUES (?, ?, ?, ?)');
$stmt->bind_param('isdi', $product_id, $size, $price, $stock);

if (!$stmt->execute()) error('Error al crear la variante', 500);

success(['id' => $conn->insert_id, 'product_id' => $product_id, 'size' => $size, 'price' => $price, 'stock' => $stock], 201);
