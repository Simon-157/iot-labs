const { db, logger } = require("../config");

const insertSensorData = (req, res) => {
    const { dateRead, timeRead, temReading, humReading, groupName, pumpStatus } = req.body;
    console.log(dateRead, timeRead, temReading, humReading, groupName, pumpStatus )
    logger.info("Inserting sensor data: " + dateRead + " " + timeRead + " " + temReading + " " + humReading + " " + groupName + " " + pumpStatus);


    if (!temReading || !humReading ||  !dateRead || !timeRead) {
        res.status(400).send('Required fields not provided');
        return;
    }

const query = 'INSERT INTO SensorReadings (dateRead, timeRead, tempReading, humReading, groupName, pumpStatus) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [dateRead, timeRead, temReading, humReading, groupName, pumpStatus], (err, result) => {
        if (err) {
            logger.error('Error inserting sensor data: ' + err.stack);
            res.status(500).send('Error inserting sensor data');
        } else {
            logger.info('Sensor data inserted successfully');
            res.status(200).send('Sensor data inserted successfully');
        }
    });
};

module.exports = {
    insertSensorData,
};

