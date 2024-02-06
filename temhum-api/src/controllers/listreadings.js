const { db } = require("../config");

const logger = require('../config').logger;
const getAllSensorData = (req, res) => {
    const query = `SELECT * FROM SensorReadings`;
    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching data: ' + err.stack);
            res.status(500).send('Error fetching data');
        } else {
            res.status(200).json(results);
        }
    });
};

const getLatTenRecords = (req, res) => {
    const query = `SELECT * FROM SensorReadings ORDER BY timeRead DESC LIMIT 10 `;
    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching data: ' + err.stack);
            res.status(500).send('Error fetching data');
        } else {
            res.status(200).json(results);
        }
    });
};


const getLatestReadings = (req, res) => {
    const query = `SELECT tempReading, humReading, pumpStatus FROM SensorReadings ORDER BY timeRead DESC LIMIT 1`;
    db.query(query, (err, results) => {
        if (err) {
            logger.error('Error fetching data: ' + err.stack);
            res.status(500).send('Error fetching data');
        } else {
            
            res.status(200).json(results);
        }
    });
};

module.exports = {
    getAllSensorData,
    getLatTenRecords,
    getLatestReadings
}

