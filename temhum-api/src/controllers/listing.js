const {db, logger} = require("../config");

const getAllSensors = (req, res) => {
    const query = 'SELECT * FROM Sensors';

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching sensors: ' + err.stack);
            res.status(500).send('Error fetching sensors');
        } else {
            res.status(200).json(results);
        }
    });
};

const getAllSensorTypes = (req, res) => {
    const query = 'SELECT * FROM SensorTypes';

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching sensor types: ' + err.stack);
            res.status(500).send('Error fetching sensor types');
        } else {
            res.status(200).json(results);
        }
    });
};

const getAllSensorLocations = (req, res) => {
    const query = 'SELECT * FROM SensorLocations';

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching sensor locations: ' + err.stack);
            res.status(500).send('Error fetching sensor locations');
        } else {
            res.status(200).json(results);
        }
    });
};
const getAllSensorData = (req, res) => {
    const query = `SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
                   FROM SensorData
                   JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
                   JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
                   JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID`;

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching data: ' + err.stack);
            res.status(500).send('Error fetching data');
        } else {
            res.status(200).json(results);
        }
    });
};

const getTemperatureReadings = (req, res) => {
    const query = `SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
                   FROM SensorData
                   JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
                   JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
                   JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
                   WHERE SensorTypes.TypeName = 'Temperature'`;

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching temperature readings: ' + err.stack);
            res.status(500).send('Error fetching temperature readings');
        } else {
            res.status(200).json(results);
        }
    });
};

const getHighTemperatureReadings = (req, res) => {
    const query = `SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
                   FROM SensorData
                   JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
                   JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
                   JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
                   WHERE SensorTypes.TypeName = 'Temperature' AND SensorData.CurrentReading > 35`;

    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching high temperature readings: ' + err.stack);
            res.status(500).send('Error fetching high temperature readings');
        } else {
            res.status(200).json(results);
        }
    });
};

const getRecordByID = (req, res) => {
    const sensorDataID = req.params.id;
    const query = `SELECT SensorData.*, Sensors.SensorName, SensorTypes.TypeName, SensorLocations.LocationName
                   FROM SensorData
                   JOIN Sensors ON SensorData.SensorID = Sensors.SensorID
                   JOIN SensorTypes ON Sensors.SensorTypeID = SensorTypes.SensorTypeID
                   JOIN SensorLocations ON Sensors.SensorLocationID = SensorLocations.SensorLocationID
                   WHERE SensorData.SensorDataID = ?`;

    db.query(query, [sensorDataID], (err, results) => {
        if (err) {
            logger.error('Error fetching record: ' + err.stack);
            res.status(500).send('Error fetching record');
        } else {
            if (results.length === 0) {
                res.status(404).send('Record not found');
            } else {
                res.status(200).json(results[0]);
            }
        }
    });
};

module.exports = {
    getAllSensors,
    getAllSensorTypes,
    getAllSensorLocations,
    getAllSensorData,
    getTemperatureReadings,
    getHighTemperatureReadings,
    getRecordByID,
};
