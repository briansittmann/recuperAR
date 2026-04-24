<?php
// Copiar este archivo como jwt.php y reemplazar JWT_SECRET por una clave larga y aleatoria
define('JWT_SECRET', 'CAMBIAR_POR_CLAVE_ALEATORIA_LARGA');
define('JWT_EXPIRY', 86400); // 24 horas

function generateJWT(array $payload): string {
    $header    = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload   = base64UrlEncode(json_encode($payload));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function validateJWT(string $token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    [$header, $payload, $signature] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

    if (!hash_equals($expected, $signature)) return false;

    $data = json_decode(base64UrlDecode($payload), true);
    if (!$data || $data['exp'] < time()) return false;

    return $data;
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}
