<?php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Nyholm\Psr7\Factory\Psr17Factory;

// Autoloading for classes
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../listing.php';
require_once __DIR__ . '/../insert.php';
require_once __DIR__ . '/../update.php';
require_once __DIR__ . '/../delete.php';

$app = AppFactory::create();
$container = $app->getContainer();

// Register the Nyholm PSR-17 response factory
$container->set('responseFactory', new Psr17Factory());

// Single endpoint for getting data based on different parameters
$app->get('/data[/{type}[/{threshold}]]', function ($request, $response, $args) {
    $type = $args['type'] ?? null;
    $threshold = $args['threshold'] ?? 35;

    if ($type === 'temperature') {
        getTemperatureReadings();
    } elseif ($type === 'high_temperature') {
        getHighTemperatureReadings($threshold);
    } else {
        getAllData();
    }
});

// Utilize caching for frequently accessed data
function getCachedData($key, $expiration) {
    $cacheFile = __DIR__ . "/cache/{$key}.json";
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $expiration) {
        return json_decode(file_get_contents($cacheFile), true);
    } else {
        $data = fetchDataFromDatabase(); // TODO: Replace with actual database query
        file_put_contents($cacheFile, json_encode($data));
        return $data;
    }
}

$app->get('/cached_data', function ($request, $response, $args) {
    $cachedData = getCachedData('all_data', 3600); // Cache for 1 hour
    return $response->withJson($cachedData);
});

// Run the Slim application
$app->run();