<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once('db-config.php');

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Función para obtener el SKU base sin el tamaño
    function getBaseSku($sku) {
        return preg_replace('/-\d+ML$/i', '', $sku);
    }

    // Función para obtener el tamaño del SKU
    function getSizeFromSku($sku) {
        if (preg_match('/-(\d+ML)$/i', $sku, $matches)) {
            return strtolower($matches[1]);
        }
        return null;
    }

    // Obtener todos los productos
    $sql = "SELECT * FROM products ORDER BY sku";
    $result = $conn->query($sql);
    
    $products = [];
    $skuGroups = [];
    
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
        $baseSku = getBaseSku($row['sku']);
        if (!isset($skuGroups[$baseSku])) {
            $skuGroups[$baseSku] = [];
        }
        $skuGroups[$baseSku][] = $row;
    }

    // Verificar qué SKUs están incompletos
    $incompleteSkus = [];
    $missingVariants = [];
    $variantsToCreate = [];

    foreach ($skuGroups as $baseSku => $variants) {
        $sizes = array_map(function($v) { return $v['size']; }, $variants);
        $requiredSizes = ['30ml', '50ml', '100ml'];
        $missingSizes = array_diff($requiredSizes, $sizes);
        
        if (!empty($missingSizes)) {
            $incompleteSkus[$baseSku] = [
                'existing_sizes' => $sizes,
                'missing_sizes' => array_values($missingSizes),
                'sample_product' => $variants[0]
            ];
            
            // Generar las variantes faltantes
            foreach ($missingSizes as $missingSize) {
                $sampleProduct = $variants[0];
                
                // Determinar el precio según el tamaño
                $price = match($missingSize) {
                    '30ml' => '9000.00',
                    '50ml' => '14000.00',
                    '100ml' => '18000.00',
                    default => '14000.00'
                };
                
                // Crear el nuevo SKU
                $newSku = $baseSku . '-' . strtoupper($missingSize);
                
                $variantsToCreate[] = [
                    'sku' => $newSku,
                    'name' => $sampleProduct['name'],
                    'description' => $sampleProduct['description'],
                    'price' => $price,
                    'size' => $missingSize,
                    'brand' => $sampleProduct['brand'],
                    'category' => $sampleProduct['category'],
                    'image_url' => $sampleProduct['image_url'],
                    'stock_quantity' => 50,
                    'is_featured' => $sampleProduct['is_featured'],
                    'rating' => $sampleProduct['rating'],
                    'notes' => $sampleProduct['notes'],
                    'duration' => $sampleProduct['duration'],
                    'original_inspiration' => $sampleProduct['original_inspiration'],
                    'concentration' => $sampleProduct['concentration'],
                    'fragrance_profile' => $sampleProduct['fragrance_profile'],
                    'fragrance_notes_top' => $sampleProduct['fragrance_notes_top'],
                    'fragrance_notes_middle' => $sampleProduct['fragrance_notes_middle'],
                    'fragrance_notes_base' => $sampleProduct['fragrance_notes_base']
                ];
            }
        }
    }

    // Si se pasa el parámetro 'fix=true', crear las variantes faltantes
    if (isset($_GET['fix']) && $_GET['fix'] === 'true') {
        $createdCount = 0;
        $errors = [];
        
        foreach ($variantsToCreate as $variant) {
            $sql = "INSERT INTO products (
                name, description, price, sku, brand, category, 
                image_url, stock_quantity, is_featured, rating, 
                notes, duration, original_inspiration, size, 
                concentration, fragrance_profile, fragrance_notes_top, 
                fragrance_notes_middle, fragrance_notes_base
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($sql);
            
            $stmt->bind_param("ssdssssidssssssssss",
                $variant['name'],
                $variant['description'],
                $variant['price'],
                $variant['sku'],
                $variant['brand'],
                $variant['category'],
                $variant['image_url'],
                $variant['stock_quantity'],
                $variant['is_featured'],
                $variant['rating'],
                $variant['notes'],
                $variant['duration'],
                $variant['original_inspiration'],
                $variant['size'],
                $variant['concentration'],
                $variant['fragrance_profile'],
                $variant['fragrance_notes_top'],
                $variant['fragrance_notes_middle'],
                $variant['fragrance_notes_base']
            );
            
            if ($stmt->execute()) {
                $createdCount++;
            } else {
                $errors[] = "Error creando " . $variant['sku'] . ": " . $stmt->error;
            }
            
            $stmt->close();
        }
        
        echo json_encode([
            'success' => true,
            'action' => 'created_variants',
            'created_count' => $createdCount,
            'total_to_create' => count($variantsToCreate),
            'errors' => $errors
        ], JSON_PRETTY_PRINT);
    } else {
        // Solo mostrar el análisis
        echo json_encode([
            'success' => true,
            'total_products' => count($products),
            'total_sku_groups' => count($skuGroups),
            'incomplete_sku_count' => count($incompleteSkus),
            'variants_to_create' => count($variantsToCreate),
            'incomplete_skus' => $incompleteSkus,
            'sample_variants_to_create' => array_slice($variantsToCreate, 0, 5),
            'note' => 'Para crear las variantes faltantes, agrega ?fix=true a la URL'
        ], JSON_PRETTY_PRINT);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
