<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Método no permitido', 405);

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$conn = getConnection();

$stmt = $conn->prepare(
    'SELECT p.id, p.name, p.description, p.image, p.created_at,
            c.id AS category_id, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?'
);
$stmt->bind_param('i', $id);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();

if (!$product) error('Producto no encontrado', 404);

$stmt2 = $conn->prepare('SELECT id, size, price, stock FROM product_variants WHERE product_id = ? ORDER BY price ASC');
$stmt2->bind_param('i', $id);
$stmt2->execute();
$product['variants'] = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);

success($product);
