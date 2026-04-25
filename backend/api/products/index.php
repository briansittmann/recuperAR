<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Método no permitido', 405);

$conn   = getConnection();
$where  = [];
$params = [];
$types  = '';

if (!empty($_GET['category'])) {
    $where[]  = 'c.slug = ?';
    $params[] = $_GET['category'];
    $types   .= 's';
}

if (!empty($_GET['search'])) {
    $where[]  = 'p.name LIKE ?';
    $params[] = '%' . $_GET['search'] . '%';
    $types   .= 's';
}

$sql = 'SELECT p.id, p.name, p.description, p.created_at,
               COALESCE(p.image, (
                   SELECT pi.image FROM product_images pi
                   WHERE pi.product_id = p.id
                   ORDER BY pi.sort_order ASC, pi.id ASC
                   LIMIT 1
               )) AS image,
               c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
               MIN(pv.price) AS min_price,
               COALESCE(SUM(pv.stock), 0) AS total_stock,
               COUNT(pv.id) AS variant_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON pv.product_id = p.id';

if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' GROUP BY p.id ORDER BY p.created_at DESC';

$stmt = $conn->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();

success($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
