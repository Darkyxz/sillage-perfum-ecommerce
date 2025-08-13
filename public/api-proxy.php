<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// --- NUEVO: Manejar subida de imagen directamente desde el proxy PHP ---
if (isset($_GET['action']) && $_GET['action'] === 'upload-image' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetDir = __DIR__ . '/uploads/products/';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No se subió ningún archivo']);
        exit();
    }
    $fileName = basename($_FILES['image']['name']);
    // Evitar colisiones de nombres
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $base = pathinfo($fileName, PATHINFO_FILENAME);
    $uniqueName = $base . '-' . time() . '-' . rand(1000,9999) . '.' . $ext;
    $targetFile = $targetDir . $uniqueName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $url = 'https://sillageperfum.cl/uploads/products/' . $uniqueName;
        echo json_encode(['success' => true, 'url' => $url]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error al guardar el archivo']);
    }
    exit();
}
// --- FIN: subida de imagen ---

// Get the API path from the query parameter
$apiPath = isset($_GET['path']) ? $_GET['path'] : '';
if (empty($apiPath)) {
    http_response_code(400);
    echo json_encode(['error' => 'API path is required']);
    exit();
}

// Build the full Vercel backend URL
$vercelBaseUrl = 'https://sillage-backend-i0jyiudue-sillageperfums-projects.vercel.app';
$fullUrl = $vercelBaseUrl . '/' . ltrim($apiPath, '/');

// Add query parameters if they exist (excluding 'path')
if (!empty($_SERVER['QUERY_STRING'])) {
    // Parse query string into array
    parse_str($_SERVER['QUERY_STRING'], $queryParams);
    
    // Remove the 'path' parameter
    unset($queryParams['path']);
    
    // Rebuild query string if we have remaining parameters
    if (!empty($queryParams)) {
        $cleanQueryString = http_build_query($queryParams);
        $fullUrl .= '?' . $cleanQueryString;
    }
}

// Initialize cURL
$ch = curl_init();

// Prepare headers
$headers = [
    'Accept: application/json',
    'User-Agent: Sillage-Proxy/1.0'
];

// Add Authorization header if present
// Try different methods to get the Authorization header
$authHeader = null;

// Method 1: Direct HTTP_AUTHORIZATION
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
}
// Method 2: From redirect (some Apache configurations)
elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
// Method 3: From getallheaders() function if available
elseif (function_exists('getallheaders')) {
    $allHeaders = getallheaders();
    if (isset($allHeaders['Authorization'])) {
        $authHeader = $allHeaders['Authorization'];
    } elseif (isset($allHeaders['authorization'])) {
        $authHeader = $allHeaders['authorization'];
    }
}
// Method 4: From apache_request_headers() if available
elseif (function_exists('apache_request_headers')) {
    $allHeaders = apache_request_headers();
    if (isset($allHeaders['Authorization'])) {
        $authHeader = $allHeaders['Authorization'];
    } elseif (isset($allHeaders['authorization'])) {
        $authHeader = $allHeaders['authorization'];
    }
}

// Add the Authorization header if we found it
if ($authHeader) {
    $headers[] = 'Authorization: ' . $authHeader;
    // Debug log (remove in production)
    error_log('PROXY DEBUG: Authorization header found: ' . $authHeader);
} else {
    // Debug log (remove in production)
    error_log('PROXY DEBUG: No Authorization header found');
    error_log('PROXY DEBUG: Available headers: ' . print_r(getallheaders(), true));
}

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_URL => $fullUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
    CURLOPT_HTTPHEADER => $headers
]);

// Handle request body for POST/PUT/PATCH requests
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $inputData = file_get_contents('php://input');
    if (!empty($inputData)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
        // Add Content-Type header for POST/PUT/PATCH requests
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
}

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

// Handle cURL errors
if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy error: ' . $error]);
    exit();
}

// Set the response code
http_response_code($httpCode);

// Output the response
echo $response;
?>
