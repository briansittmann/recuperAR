<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$name        = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$category_id = isset($_POST['category_id']) && $_POST['category_id'] !== '' ? intval($_POST['category_id']) : null;

if (!$name) error('Nombre requerido');

$imagePath = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowed  = ['image/jpeg', 'image/png', 'image/webp'];
    $mimeType = mime_content_type($_FILES['image']['tmp_name']);

    if (!in_array($mimeType, $allowed)) error('Solo se permiten imágenes JPG, PNG o WEBP');
    if ($_FILES['image']['size'] > 2 * 1024 * 1024) error('La imagen no puede superar 2MB');

    $ext       = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $filename  = uniqid('product_', true) . '.' . $ext;
    $uploadDir = __DIR__ . '/../uploads/';

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
        error('Error al subir la imagen', 500);
    }

    $imagePath = 'uploads/' . $filename;
}

$conn = getConnection();

if ($category_id !== null) {
    $stmt = $conn->prepare('INSERT INTO products (name, description, image, category_id) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('sssi', $name, $description, $imagePath, $category_id);
} else {
    $stmt = $conn->prepare('INSERT INTO products (name, description, image) VALUES (?, ?, ?)');
    $stmt->bind_param('sss', $name, $description, $imagePath);
}

if (!$stmt->execute()) error('Error al crear el producto', 500);

success(['id' => $conn->insert_id, 'name' => $name, 'image' => $imagePath], 201);
