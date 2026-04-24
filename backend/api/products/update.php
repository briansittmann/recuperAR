<?php
// Usa POST porque PHP no parsea multipart/form-data en PUT nativamente.
// Desde React enviar como: POST /api/products/update.php?id=X con FormData
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$name        = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$category_id = isset($_POST['category_id']) && $_POST['category_id'] !== '' ? intval($_POST['category_id']) : null;

if (!$name) error('Nombre requerido');

$conn = getConnection();

$stmt = $conn->prepare('SELECT image FROM products WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();
if (!$existing) error('Producto no encontrado', 404);

$imagePath = $existing['image'];

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowed  = ['image/jpeg', 'image/png', 'image/webp'];
    $mimeType = mime_content_type($_FILES['image']['tmp_name']);

    if (!in_array($mimeType, $allowed)) error('Solo se permiten imágenes JPG, PNG o WEBP');
    if ($_FILES['image']['size'] > 2 * 1024 * 1024) error('La imagen no puede superar 2MB');

    if ($imagePath && file_exists(__DIR__ . '/../' . $imagePath)) {
        unlink(__DIR__ . '/../' . $imagePath);
    }

    $ext       = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $filename  = uniqid('product_', true) . '.' . $ext;
    $uploadDir = __DIR__ . '/../uploads/';

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
        error('Error al subir la imagen', 500);
    }

    $imagePath = 'uploads/' . $filename;
}

if ($category_id !== null) {
    $stmt2 = $conn->prepare('UPDATE products SET name = ?, description = ?, image = ?, category_id = ? WHERE id = ?');
    $stmt2->bind_param('sssii', $name, $description, $imagePath, $category_id, $id);
} else {
    $stmt2 = $conn->prepare('UPDATE products SET name = ?, description = ?, image = ?, category_id = NULL WHERE id = ?');
    $stmt2->bind_param('sssi', $name, $description, $imagePath, $id);
}

if (!$stmt2->execute()) error('Error al actualizar', 500);

success(['id' => $id, 'name' => $name, 'image' => $imagePath]);
