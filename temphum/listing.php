<?php
include 'config.php';

// Function to retrieve all data
function getAllData($outputFormat = 'json') {
    global $conn;

    $sql = "SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
            FROM SensorData
            JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
            LEFT JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
            LEFT JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            // Display tabular data
            echo "<table border='1'>";
            echo "<tr><th>SensorDataID</th><th>SensorName</th><th>TypeName</th><th>LocationName</th><th>CurrentReading</th><th>DateRead</th><th>TimeRead</th></tr>";
            foreach ($data as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>$value</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "No records found.";
    }
}

// Function to retrieve only temperature readings
function getTemperatureReadings($outputFormat = 'json') {
    global $conn;

    $sql = "SELECT SensorData.*, Sensors.SensorName, SensorLocations.LocationName
            FROM SensorData
            JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
            LEFT JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
            WHERE Sensors.SensorTypeID IN (SELECT SensorTypeID FROM SensorTypes WHERE TypeName = 'Temperature')";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            // Display tabular data
            echo "<table border='1'>";
            echo "<tr><th>SensorDataID</th><th>SensorName</th><th>LocationName</th><th>CurrentReading</th><th>DateRead</th><th>TimeRead</th></tr>";
            foreach ($data as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>$value</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "No temperature readings found.";
    }
}

// Function to retrieve records where temperature readings are higher than a threshold
function getHighTemperatureReadings($threshold = 35, $outputFormat = 'json') {
    global $conn;

    $sql = "SELECT SensorData.*, Sensors.SensorName, SensorLocations.LocationName
            FROM SensorData
            JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
            LEFT JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
            WHERE Sensors.SensorTypeID IN (SELECT SensorTypeID FROM SensorTypes WHERE TypeName = 'Temperature')
            AND SensorData.CurrentReading > $threshold";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            // Display tabular data
            echo "<table border='1'>";
            echo "<tr><th>SensorDataID</th><th>SensorName</th><th>LocationName</th><th>CurrentReading</th><th>DateRead</th><th>TimeRead</th></tr>";
            foreach ($data as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>$value</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "No records with temperature readings higher than $threshold found.";
    }
}

// Function to retrieve a particular record given SensorDataID
function getRecordByID($sensorDataID, $outputFormat = 'json') {
    global $conn;

    $sql = "SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
            FROM SensorData
            JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
            LEFT JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
            LEFT JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
            WHERE SensorData.SensorDataID = $sensorDataID";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            // Display tabular data
            echo "<table border='1'>";
            echo "<tr><th>SensorDataID</th><th>SensorName</th><th>TypeName</th><th>LocationName</th><th>CurrentReading</th><th>DateRead</th><th>TimeRead</th></tr>";
            foreach ($data as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>$value</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "No record found with SensorDataID: $sensorDataID";
    }
}

// Determine the action based on the parameter passed in the URL
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'all':
        getAllData(isset($_GET['format']) ? $_GET['format'] : 'json');
        break;
    case 'temperature':
        getTemperatureReadings(isset($_GET['format']) ? $_GET['format'] : 'json');
        break;
    case 'high_temperature':
        $threshold = isset($_GET['threshold']) ? $_GET['threshold'] : 35;
        getHighTemperatureReadings($threshold, isset($_GET['format']) ? $_GET['format'] : 'json');
        break;
    case 'record':
        if (isset($_GET['id'])) {
            getRecordByID($_GET['id'], isset($_GET['format']) ? $_GET['format'] : 'json');
        } else {
            echo "Please provide a valid SensorDataID.";
        }
        break;
    default:
        echo "Invalid action.";
        break;
}

$conn->close();
?>
