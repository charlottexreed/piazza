const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json());
require('dotenv/config')

// Initialises the routes so you can access them from the mentioned link
const authRoute = require('./routes/auth')
const feedRoute = require('./routes/posts')
app.use('/api/user', authRoute)
app.use('/api/feed', feedRoute)


// Connects to the MongoDB database and listens to the port, taken from the labs
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

app.get('/', async(req,res)=> {
    try{
        res.send('hi')
    }catch(err){
        res.status(400).send({message:err})
    }
})