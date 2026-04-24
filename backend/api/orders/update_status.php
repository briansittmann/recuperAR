<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Método no permitido', 405);

requireAdmin();

$id = intval($_GET['id'] ?? 0);
if (!$id) error('ID requerido');

$body   = json_decode(file_get_contents('php://input'), true);
$status = trim($body['status'] ?? '');

$valid = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
if (!in_array($status, $valid)) {
    error('Status inválido. Válidos: ' . implode(', ', $valid));
}

$conn = getConnection();
$stmt = $conn->prepare('UPDATE orders SET status = ? WHERE id = ?');
$stmt->bind_param('si', $status, $id);
$stmt->execute();

if ($stmt->affected_rows === 0) error('Orden no encontrada', 404);

success(['id' => $id, 'status' => $status]);
