<?php
include 'config.php';

function updateData($sensorDataID, $currentReading, $dateRead, $timeRead) {
    global $conn;

    $sql = "UPDATE SensorData SET CurrentReading = $currentReading, DateRead = '$dateRead', TimeRead = '$timeRead' WHERE SensorDataID = $sensorDataID";
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully.";
    } else {
        echo "Error updating record: " . $conn->error;
    }
}

// Example usage
updateData(1, 35.5, "2029-02-01", "14:30:00"); // Replace with the actual SensorDataID

$conn->close();
?>
