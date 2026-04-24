<?php
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

function requireAdmin(): array {
    $auth = '';

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? '';
    }

    if (!$auth || substr($auth, 0, 7) !== 'Bearer ') {
        error('No autorizado', 401);
    }

    $payload = validateJWT(substr($auth, 7));

    if (!$payload) {
        error('Token inválido o expirado', 401);
    }

    return $payload;
}
