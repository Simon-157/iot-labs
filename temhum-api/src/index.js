const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const listingController = require('./controllers/listing');
const updateController = require('./controllers/update');
const deleteController = require('./controllers/delete');
const insertController = require('./controllers/insert');
const { logger } = require('./config');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Logging setup

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.get('/', (req, res) => {
    try {
        res.sendFile('index.html', { root: __dirname });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/header.html', (req, res) => {
    try {
        res.sendFile('header.html', { root: __dirname });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})


app.get('/dashboard', (req, res) =>{
   try{
    res.sendFile('dashboard.html', { root: __dirname });
   }
    catch(error){
     res.status(500).send('Internal Server Error');

    }
})

app.get('/create', (req, res) =>{

    try{
        res.sendFile('create.html', { root: __dirname });
    }
    catch(error){
        res.status(500).send('Internal Server Error');
    }   

})

app.get('/api/data', (req, res) => {
    const dataType = req.query.type;

    switch (dataType) {
        case 'sensors':
            return listingController.getAllSensors(req, res);
        case 'sensorTypes':
            return listingController.getAllSensorTypes(req, res);
        case 'sensorLocations':
            return listingController.getAllSensorLocations(req, res);
        case 'sensorData':
            return listingController.getAllSensorData(req, res);
        case 'temperature':
            return listingController.getTemperatureReadings(req, res);
        case 'high-temperature':
            return listingController.getHighTemperatureReadings(req, res);
        case 'record':
            return listingController.getRecordByID(req, res);
        default:
            return res.status(400).send('Invalid data type specified');
    }
});

app.put('/api/sensorData/update/:id', updateController.updateRecordByID);
app.delete('/api/sensorData/delete/:id', deleteController.deleteRecordByID);

app.post('/api/sensors/insert', insertController.insertSensor);
app.post('/api/sensorTypes/insert', insertController.insertSensorType);
app.post('/api/sensorLocations/insert', insertController.insertSensorLocation);
app.post('/api/sensorData/insert', insertController.insertSensorData);

app.listen(port, '192.168.115.209', () => {
    logger.info(`Server listening at http://0.0.0.0:${port}`);
});

// app.listen(port, () => {
//     logger.info(`Server listening at http://localhost:${port}`);
// });
