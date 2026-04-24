<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Método no permitido', 405);

$body     = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) error('Email y contraseña requeridos');

$conn = getConnection();
$stmt = $conn->prepare('SELECT id, email, password FROM admins WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

if (!$admin || !password_verify($password, $admin['password'])) {
    error('Credenciales inválidas', 401);
}

$token = generateJWT(['admin_id' => $admin['id'], 'email' => $admin['email']]);
success(['token' => $token]);
