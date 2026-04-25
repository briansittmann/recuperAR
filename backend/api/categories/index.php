<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Método no permitido', 405);

$conn   = getConnection();
$result = $conn->query('SELECT id, name, slug, icon FROM categories ORDER BY name ASC');
success($result->fetch_all(MYSQLI_ASSOC));
