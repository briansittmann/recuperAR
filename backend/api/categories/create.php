<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$body = json_decode(file_get_contents('php://input'), true);
$name = trim($body['name'] ?? '');
$slug = trim($body['slug'] ?? '');

if (!$name || !$slug) error('Nombre y slug requeridos');
if (!preg_match('/^[a-z0-9-]+$/', $slug)) error('Slug solo puede contener letras minúsculas, números y guiones');

$conn = getConnection();
$stmt = $conn->prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
$stmt->bind_param('ss', $name, $slug);

if (!$stmt->execute()) {
    if ($conn->errno === 1062) error('Ya existe una categoría con ese slug');
    error('Error al crear la categoría', 500);
}

success(['id' => $conn->insert_id, 'name' => $name, 'slug' => $slug], 201);
