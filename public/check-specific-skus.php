<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuración de la base de datos
$servername = "localhost";
$username = "sillage_admin";
$password = "KYBDj^HF*P*g3BK=";
$dbname = "sillage_db";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // SKUs específicos a verificar
    $specificSkus = ['ZBM-COC', 'ZP108W', 'ZP87W'];
    
    $results = [];
    
    foreach ($specificSkus as $baseSku) {
        // Buscar todas las variantes de este SKU base
        $sql = "SELECT * FROM products WHERE sku LIKE ? ORDER BY size";
        $stmt = $conn->prepare($sql);
        $searchPattern = $baseSku . '%';
        $stmt->bind_param('s', $searchPattern);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $variants = [];
        while ($row = $result->fetch_assoc()) {
            $variants[] = [
                'id' => $row['id'],
                'sku' => $row['sku'],
                'name' => $row['name'],
                'size' => $row['size'],
                'price' => $row['price'],
                'stock' => $row['stock_quantity'],
                'in_stock' => $row['in_stock']
            ];
        }
        
        $sizes = array_map(function($v) { return $v['size']; }, $variants);
        $missingSizes = array_diff(['30ml', '50ml', '100ml'], $sizes);
        
        $results[$baseSku] = [
            'base_sku' => $baseSku,
            'variant_count' => count($variants),
            'existing_sizes' => $sizes,
            'missing_sizes' => array_values($missingSizes),
            'variants' => $variants,
            'complete' => empty($missingSizes)
        ];
        
        $stmt->close();
    }
    
    // También buscar por SKU exacto para los casos problemáticos
    $exactSkus = ['ZBM-COC-50ML', 'ZP108W-100ML', 'ZP87W-50ML'];
    $exactResults = [];
    
    foreach ($exactSkus as $exactSku) {
        $sql = "SELECT * FROM products WHERE sku = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $exactSku);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            $exactResults[$exactSku] = [
                'found' => true,
                'details' => [
                    'id' => $row['id'],
                    'sku' => $row['sku'],
                    'name' => $row['name'],
                    'size' => $row['size'],
                    'price' => $row['price']
                ]
            ];
        } else {
            $exactResults[$exactSku] = [
                'found' => false
            ];
        }
        
        $stmt->close();
    }
    
    echo json_encode([
        'success' => true,
        'analysis_by_base_sku' => $results,
        'exact_sku_search' => $exactResults,
        'summary' => [
            'ZBM-COC' => count($results['ZBM-COC']['variants']) . ' variantes encontradas, faltan: ' . implode(', ', $results['ZBM-COC']['missing_sizes']),
            'ZP108W' => count($results['ZP108W']['variants']) . ' variantes encontradas, faltan: ' . implode(', ', $results['ZP108W']['missing_sizes']),
            'ZP87W' => count($results['ZP87W']['variants']) . ' variantes encontradas, faltan: ' . implode(', ', $results['ZP87W']['missing_sizes'])
        ]
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
