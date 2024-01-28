const {db, logger} = require("../config");

const deleteRecordByID = (req, res) => {
    const sensorDataID = req.params.id;
    const query = 'DELETE FROM SensorData WHERE SensorDataID = ?';

    db.query(query, [sensorDataID], (err, result) => {
        if (err) {
            logger.error('Error deleting record: ' + err.stack);
            res.status(500).send('Error deleting record');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send('Record not found');
            } else {
                res.status(200).send('Record deleted successfully');
            }
        }
    });
};

module.exports = {
    deleteRecordByID,
};
