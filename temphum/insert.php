<?php
include 'config.php';

function insertData($sensorName, $sensorTypeID, $currentReading, $dateRead, $timeRead, $sensorLocationID) {
    global $conn;

    // Perform data validation as needed

    $sql = "INSERT INTO Sensors (SensorName, SensorTypeID, SensorLocationID) VALUES ('$sensorName', $sensorTypeID, $sensorLocationID)";
    if ($conn->query($sql) === TRUE) {
        $sensorID = $conn->insert_id;

        $sql = "INSERT INTO SensorData (SensorID, CurrentReading, DateRead, TimeRead) VALUES ($sensorID, $currentReading, '$dateRead', '$timeRead')";
        if ($conn->query($sql) === TRUE) {
            echo "Record inserted successfully.";
        } else {
            echo "Error inserting data: " . $conn->error;
        }
    } else {
        echo "Error inserting data: " . $conn->error;
    }
}

// Example usage
insertData("Temp1", 1, 32.1, "2029-01-30", "12:05:24", 1);

$conn->close();
?>
