<?php
include 'config.php';

function deleteData($sensorDataID) {
    global $conn;

    $sql = "DELETE FROM SensorData WHERE SensorDataID = $sensorDataID";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully.";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

// Example usage
deleteData(1); // Replace with the actual SensorDataID

$conn->close();
?>
