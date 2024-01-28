const {db, logger} = require("../config");


const updateRecordByID = (req, res) => {
    const sensorDataID = req.params.id;
    const { CurrentReading, DateRead, TimeRead } = req.body;

    const query = 'UPDATE SensorData SET CurrentReading = ?, DateRead = ?, TimeRead = ? WHERE SensorDataID = ?';

    db.query(query, [CurrentReading, DateRead, TimeRead, sensorDataID], (err, result) => {
        if (err) {
            logger.error('Error updating record: ' + err.stack);
            res.status(500).send('Error updating record');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Record not found');
            } else {
                res.status(200).send('Record updated successfully');
            }
        }
    });
};

module.exports = {
    updateRecordByID,
};
