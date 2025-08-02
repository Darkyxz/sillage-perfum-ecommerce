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

// Get the API path from the query parameter
$apiPath = isset($_GET['path']) ? $_GET['path'] : '';
if (empty($apiPath)) {
    http_response_code(400);
    echo json_encode(['error' => 'API path is required']);
    exit();
}

// Build the full Vercel backend URL
$vercelBaseUrl = 'https://sillage-backend-m5hzs0ps5-sillageperfums-projects.vercel.app';
$fullUrl = $vercelBaseUrl . '/' . ltrim($apiPath, '/');

// Add query parameters if they exist
if (!empty($_SERVER['QUERY_STRING'])) {
    $queryString = $_SERVER['QUERY_STRING'];
    // Remove the 'path' parameter from query string
    $queryString = preg_replace('/&?path=[^&]*/', '', $queryString);
    $queryString = ltrim($queryString, '&');
    
    if (!empty($queryString)) {
        $fullUrl .= '?' . $queryString;
    }
}

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_URL => $fullUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'User-Agent: Sillage-Proxy/1.0'
    ]
]);

// Handle request body for POST/PUT/PATCH requests
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $inputData = file_get_contents('php://input');
    if (!empty($inputData)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'User-Agent: Sillage-Proxy/1.0',
            'Content-Type: application/json'
        ]);
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
