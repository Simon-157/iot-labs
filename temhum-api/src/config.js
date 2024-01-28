const mysql = require('mysql');
const winston = require('winston');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simple_data',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});


module.exports = {
    db,
    logger
};