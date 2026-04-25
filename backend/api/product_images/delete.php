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

$stmt = $conn->prepare('SELECT image FROM product_images WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$img = $stmt->get_result()->fetch_assoc();
if (!$img) error('Imagen no encontrada', 404);

// Borrar archivo del disco
$filePath = __DIR__ . '/../' . $img['image'];
if (file_exists($filePath)) @unlink($filePath);

// Borrar registro
$del = $conn->prepare('DELETE FROM product_images WHERE id = ?');
$del->bind_param('i', $id);
if (!$del->execute()) error('Error al eliminar', 500);

success(['id' => $id]);
