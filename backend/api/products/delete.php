<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') error('Método no permitido', 405);

requireAdmin();

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$conn = getConnection();

$stmt = $conn->prepare('SELECT image FROM products WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();
if (!$product) error('Producto no encontrado', 404);

$del = $conn->prepare('DELETE FROM products WHERE id = ?');
$del->bind_param('i', $id);
$del->execute();

if ($product['image'] && file_exists(__DIR__ . '/../' . $product['image'])) {
    unlink(__DIR__ . '/../' . $product['image']);
}

success(['message' => 'Producto eliminado']);
