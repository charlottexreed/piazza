const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')


//Connects to the database and listens to the port, taken from the labs
mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => {
        console.log('Database is now connected');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
app.listen(3000, ()=> {
    console.log('Server is running...')
})