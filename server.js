// Importing 
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv'

//App configuration
const app = express();
const port = process.env.PORT || 9000

//reading .env fle to nodeprocess
dotenv.config({ path: './config.env' });

// Middlewares

/// Database Config
const connection_url = process.env.databaseconnection;
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//???? 


//Api routes
app.get('/', (req, res) => res.status(200).send('Hello world bro'))


//Listn
app.listen(port, ()=> console.log(`Listening on port ${port}`))




