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

// Verificar que existe + obtener portada
$stmt = $conn->prepare('SELECT image FROM products WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();
if (!$product) error('Producto no encontrado', 404);

// Obtener imágenes de galería para borrar archivos del disco
$imgs = [];
if ($product['image']) $imgs[] = $product['image'];

$gal = $conn->prepare('SELECT image FROM product_images WHERE product_id = ?');
$gal->bind_param('i', $id);
$gal->execute();
foreach ($gal->get_result()->fetch_all(MYSQLI_ASSOC) as $row) {
    $imgs[] = $row['image'];
}

// DELETE — si falla por FK constraint, mensaje útil
$del = $conn->prepare('DELETE FROM products WHERE id = ?');
$del->bind_param('i', $id);

if (!$del->execute()) {
    if ($conn->errno === 1451) {
        error('No se puede eliminar: el producto tiene órdenes o variantes asociadas. Eliminá las dependencias primero o configurá ON DELETE CASCADE.', 409);
    }
    error('Error al eliminar el producto: ' . $conn->error, 500);
}

// Limpiar archivos del disco
foreach ($imgs as $img) {
    $path = __DIR__ . '/../' . $img;
    if (file_exists($path)) @unlink($path);
}

success(['message' => 'Producto eliminado', 'id' => $id]);
