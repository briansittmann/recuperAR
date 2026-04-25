<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Método no permitido', 405);

requireAdmin();

$conn = getConnection();

if (!empty($_GET['status'])) {
    $status = $_GET['status'];
    $stmt   = $conn->prepare('SELECT id, email, name, phone, total, status, payment_method, created_at FROM orders WHERE status = ? ORDER BY created_at DESC');
    $stmt->bind_param('s', $status);
    $stmt->execute();
    $orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $orders = $conn->query('SELECT id, email, name, phone, total, status, payment_method, created_at FROM orders ORDER BY created_at DESC')->fetch_all(MYSQLI_ASSOC);
}

success($orders);
