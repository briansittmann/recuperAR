<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

requireAdmin();

$body  = json_decode(file_get_contents('php://input'), true) ?: [];
$order = $body['order'] ?? [];

if (!is_array($order) || empty($order)) error('Falta el array "order"');

$conn = getConnection();
$conn->begin_transaction();

try {
    $stmt = $conn->prepare('UPDATE product_images SET sort_order = ? WHERE id = ?');
    foreach ($order as $i => $id) {
        $idInt = intval($id);
        $iInt  = intval($i);
        $stmt->bind_param('ii', $iInt, $idInt);
        $stmt->execute();
    }
    $conn->commit();
} catch (Exception $e) {
    $conn->rollback();
    error('Error al reordenar', 500);
}

success(['order' => $order]);
