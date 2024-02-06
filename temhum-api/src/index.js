const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const listingController = require('./controllers/listreadings');
const insertController = require('./controllers/insertreadings');
const { logger } = require('./config');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const ESP32_IP = process.env.ESP32_IP || 'http://38.0.101.76:80';

app.use(bodyParser.json());


// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err);
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

app.get('/current', (req, res) => {
    try {
        res.sendFile('current.html', { root: __dirname });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/latest', (req, res) => {  
    try {
        res.sendFile('latest.html', { root: __dirname });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/data', (req, res) => {
    const dataType = req.query.type;
    
    switch (dataType) {
        case 'all':
            return listingController.getAllSensorData(req, res);
        case 'current':
            return listingController.getLatTenRecords(req, res);
            case 'latest':
                return listingController.getLatestReadings(req, res);
                default:
                    return res.status(400).send('Invalid data type specified');
    }
});

// app.put('/api/sensorData/update/:id', updateController.updateRecordByID);
app.post('/api/readings/insert', insertController.insertSensorData);



app.get('/mode', async (req, res) => {
  const { auto } = req.query;

  if (typeof auto === 'undefined') {
    return res.status(400).json({ error: 'Missing "auto" query parameter' });
  }

  try {
    const response = await axios.get(`${ESP32_IP}/mode?auto=${auto}`);
    return res.status(200).json({ message: response.data });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Failed to send request to ESP32' });
  }
});


app.get('/pump', async (req, res) => {
  const { state } = req.query;

  if (typeof state === 'undefined') {
    return res.status(400).json({ error: 'Missing "state" query parameter' });
  }

  try {
    const response = await axios.get(`${ESP32_IP}/pump?state=${state}`);
    return res.status(200).json({ message: response.data });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Failed to send request to ESP32' });
  }
});



app.listen(port, '172.16.10.104', () => {
    logger.info(`Server listening at http://0.0.0.0:${port}`);
});
