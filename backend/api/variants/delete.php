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
$stmt = $conn->prepare('DELETE FROM product_variants WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();

if ($stmt->affected_rows === 0) error('Variante no encontrada', 404);

success(['message' => 'Variante eliminada']);
