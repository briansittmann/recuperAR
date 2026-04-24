<?php
// Copiar este archivo como db.php y rellenar con los datos reales
define('DB_HOST', 'localhost');
define('DB_USER', 'TU_USUARIO_DB');
define('DB_PASS', 'TU_PASSWORD_DB');
define('DB_NAME', 'TU_NOMBRE_DB');

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
