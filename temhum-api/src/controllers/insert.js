const {db, logger} = require("../config");

const insertSensor = (req, res) => {
    const { SensorName, SensorTypeID, SensorLocationID } = req.body;

    if (!SensorName || !SensorTypeID || !SensorLocationID) {
        res.status(400).send('Required fields not provided');
        return;
    }

    const query = 'INSERT INTO Sensors (SensorName, SensorTypeID, SensorLocationID) VALUES (?, ?, ?)';

    db.query(query, [SensorName, SensorTypeID, SensorLocationID], (err, result) => {
        if (err) {
            logger.error('Error inserting sensor: ' + err.stack);
            res.status(500).send('Error inserting sensor');
        } else {
            res.status(200).send('Sensor inserted successfully');
        }
    });
};

const insertSensorType = (req, res) => {
    const { TypeName } = req.body;

    if (!TypeName) {
        res.status(400).send('Required fields not provided');
        return;
    }

    const query = 'INSERT INTO SensorTypes (TypeName) VALUES (?)';

    db.query(query, [TypeName], (err, result) => {
        if (err) {
            logger.error('Error inserting sensor type: ' + err.stack);
            res.status(500).send('Error inserting sensor type');
        } else {
            res.status(200).send('Sensor type inserted successfully');
        }
    });
};

const insertSensorLocation = (req, res) => {
    const { LocationName } = req.body;

    if (!LocationName) {
        res.status(400).send('Required fields not provided');
        return;
    }

    const query = 'INSERT INTO SensorLocations (LocationName) VALUES (?)';

    db.query(query, [LocationName], (err, result) => {
        if (err) {
            logger.error('Error inserting sensor location: ' + err.stack);
            res.status(500).send('Error inserting sensor location');
        } else {
            res.status(200).send('Sensor location inserted successfully');
        }
    });
};

const insertSensorData = (req, res) => {
    const { SensorID, CurrentReading, DateRead, TimeRead } = req.body;

    if (!SensorID || !CurrentReading || !DateRead || !TimeRead) {
        res.status(400).send('Required fields not provided');
        return;
    }

    const query = 'INSERT INTO SensorData (SensorID, CurrentReading, DateRead, TimeRead) VALUES (?, ?, ?, ?)';

    db.query(query, [SensorID, CurrentReading, DateRead, TimeRead], (err, result) => {
        if (err) {
            logger.error('Error inserting sensor data: ' + err.stack);
            res.status(500).send('Error inserting sensor data');
        } else {
            res.status(200).send('Sensor data inserted successfully');
        }
    });
};

module.exports = {
    insertSensor,
    insertSensorType,
    insertSensorLocation,
    insertSensorData,
};
