<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Debug: Log de la petición
error_log("DEBUG PROXY - Request: " . print_r($_GET, true));
error_log("DEBUG PROXY - Headers: " . print_r(getallheaders(), true));

$path = $_GET['path'] ?? '';
if (empty($path)) {
    echo json_encode(['error' => 'No path provided']);
    exit;
}

// Construir la URL del backend
$backend_url = 'https://sillage-backend-m5hzs0ps5-sillageperfums-projects.vercel.app/' . $path;

// Agregar parámetros de query si existen
$query_params = $_GET;
unset($query_params['path']);
if (!empty($query_params)) {
    $backend_url .= '?' . http_build_query($query_params);
}

// Información de debug
$debug_info = [
    'debug' => true,
    'proxy_url' => $backend_url,
    'original_path' => $path,
    'query_params' => $query_params
];

// Ahora hacemos la llamada real al backend
// Configurar cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $backend_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Headers
$headers = [
    'Content-Type: application/json',
    'Accept: application/json'
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Ejecutar petición
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Debug: Log de la respuesta
error_log("DEBUG PROXY - Backend URL: " . $backend_url);
error_log("DEBUG PROXY - HTTP Code: " . $http_code);
error_log("DEBUG PROXY - Response: " . $response);
error_log("DEBUG PROXY - cURL Error: " . $curl_error);

// Enviar respuesta con información de debug
if ($curl_error) {
    http_response_code(500);
    echo json_encode(array_merge($debug_info, ['error' => 'cURL Error: ' . $curl_error]));
} else {
    // Si hay error del backend, incluir info de debug
    if ($http_code >= 400) {
        echo json_encode(array_merge($debug_info, [
            'backend_http_code' => $http_code,
            'backend_response' => $response,
            'error' => 'Backend returned error code: ' . $http_code
        ]));
    } else {
        // Respuesta exitosa del backend
        echo $response;
    }
}
?>
