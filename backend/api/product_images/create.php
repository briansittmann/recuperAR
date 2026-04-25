<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$product_id = intval($_POST['product_id'] ?? 0);
if (!$product_id) error('product_id requerido');

if (empty($_FILES['images']) || !is_array($_FILES['images']['name'])) {
    error('No se recibieron imágenes');
}

$conn = getConnection();

// Verificar que el producto existe
$stmt = $conn->prepare('SELECT id FROM products WHERE id = ?');
$stmt->bind_param('i', $product_id);
$stmt->execute();
if (!$stmt->get_result()->fetch_assoc()) error('Producto no encontrado', 404);

// Contar imágenes existentes
$stmt = $conn->prepare('SELECT COUNT(*) AS c, COALESCE(MAX(sort_order), -1) AS m FROM product_images WHERE product_id = ?');
$stmt->bind_param('i', $product_id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$existingCount = (int) $row['c'];
$nextOrder     = (int) $row['m'] + 1;

$count = count($_FILES['images']['name']);
if ($existingCount + $count > 6) {
    error('Máximo 6 imágenes por producto. Actualmente hay ' . $existingCount . '.');
}

$allowed   = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize   = 2 * 1024 * 1024;
$uploadDir = __DIR__ . '/../uploads/';

if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$saved = [];

for ($i = 0; $i < $count; $i++) {
    $err = $_FILES['images']['error'][$i];
    if ($err !== UPLOAD_ERR_OK) error("Error de subida en imagen #" . ($i + 1));

    $tmp  = $_FILES['images']['tmp_name'][$i];
    $name = $_FILES['images']['name'][$i];
    $size = $_FILES['images']['size'][$i];

    $mime = function_exists('mime_content_type') ? mime_content_type($tmp) : ($_FILES['images']['type'][$i] ?? '');
    if (!in_array($mime, $allowed, true)) error('Solo se permiten imágenes JPG, PNG o WEBP');
    if ($size > $maxSize) error('Cada imagen debe ser menor a 2MB');

    $ext      = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $filename = uniqid('product_img_', true) . '.' . $ext;
    $path     = 'uploads/' . $filename;

    if (!move_uploaded_file($tmp, $uploadDir . $filename)) {
        error('Error al guardar la imagen', 500);
    }

    $ins = $conn->prepare('INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)');
    $ins->bind_param('isi', $product_id, $path, $nextOrder);
    if (!$ins->execute()) {
        @unlink($uploadDir . $filename);
        error('Error al insertar la imagen', 500);
    }

    $saved[] = [
        'id'         => $conn->insert_id,
        'image'      => $path,
        'sort_order' => $nextOrder,
    ];

    $nextOrder++;
}

success(['images' => $saved], 201);
