<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON data from request
$input = file_get_contents('php://input');
$userData = json_decode($input, true);

if (!$userData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Path to users.json file
$usersFile = __DIR__ . '/data/users.json';

// Read existing users
$existingUsers = [];
if (file_exists($usersFile)) {
    $fileContent = file_get_contents($usersFile);
    $existingUsers = json_decode($fileContent, true);
    
    // Handle both array and object format
    if (!is_array($existingUsers)) {
        $existingUsers = [];
    }
}

// Add new user
$existingUsers[] = $userData;

// Save back to file
$jsonData = json_encode($existingUsers, JSON_PRETTY_PRINT);
if (file_put_contents($usersFile, $jsonData)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'User saved successfully',
        'user' => $userData
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save user']);
}
?>
