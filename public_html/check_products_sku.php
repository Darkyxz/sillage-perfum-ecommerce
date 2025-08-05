<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'sillage_db';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener el SKU base del parámetro GET
    $baseSku = isset($_GET['sku']) ? $_GET['sku'] : 'ZP108W';
    
    // Buscar todos los productos con este SKU base
    $stmt = $pdo->prepare("SELECT id, sku, name, brand, category, ml, size, price, stock, in_stock FROM products WHERE sku LIKE :sku ORDER BY ml");
    $stmt->execute([':sku' => $baseSku . '%']);
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'base_sku' => $baseSku,
        'total_variants' => count($products),
        'products' => $products
    ], JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
