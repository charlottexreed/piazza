const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')

//Uses the auth route so users can start registering and loggin in at the user page
const authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

//Connects to the MongoDB database and listens to the port, taken from the labs
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